// Simple authentication system using localStorage
// In production, this would be replaced with proper backend authentication

export type UserRole = 'admin' | 'contributor' | 'member' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  invitedBy?: string; // ID of user who created the invite (optional)
  roleAssignedAt: string; // Timestamp of role assignment
  roleAssignedReason: 'first_user' | 'invite_specified' | 'invite_default' | 'no_invite_default' | 'admin_changed';
}

export interface AuthUser extends User {
  password: string; // Hashed in production
}

// Default admin user
const DEFAULT_ADMIN: AuthUser = {
  id: 'admin-default',
  email: 'admin@amanah.app',
  password: 'admin123', // Change this in production!
  name: 'Admin',
  role: 'admin',
  createdAt: new Date().toISOString(),
  roleAssignedAt: new Date().toISOString(),
  roleAssignedReason: 'first_user',
};

// Get all users
function getUsers(): AuthUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('amanah_users');
    const users = stored ? JSON.parse(stored) : [];
    
    // Add default admin if no users exist
    if (users.length === 0) {
      users.push(DEFAULT_ADMIN);
      localStorage.setItem('amanah_users', JSON.stringify(users));
    }
    
    return users;
  } catch (error) {
    console.error('Error loading users:', error);
    return [DEFAULT_ADMIN];
  }
}

// Save users
function saveUsers(users: AuthUser[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('amanah_users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

// Get current user
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('amanah_current_user');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading current user:', error);
    return null;
  }
}

// Set current user
function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem('amanah_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('amanah_current_user');
    }
  } catch (error) {
    console.error('Error saving current user:', error);
  }
}
// Role assignment logic
interface RoleAssignmentContext {
  inviteToken?: string;
  existingUserCount: number;
}

interface RoleAssignmentResult {
  role: UserRole;
  reason: 'first_user' | 'invite_specified' | 'invite_default' | 'no_invite_default';
  invitedBy?: string;
}

function determineUserRole(context: RoleAssignmentContext): RoleAssignmentResult {
  // First user exception: always assign Admin role
  if (context.existingUserCount === 0) {
    return {
      role: 'admin',
      reason: 'first_user',
    };
  }

  // If invite token provided, validate and extract role
  if (context.inviteToken) {
    // Get invite codes from localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('amanah_invite_codes');
        if (stored) {
          const inviteCodes = JSON.parse(stored);
          const invite = inviteCodes.find(
            (i: any) => i.code.toUpperCase() === context.inviteToken!.toUpperCase()
          );

          // Validate invite token
          if (invite &&
              invite.isActive &&
              !invite.usedBy &&
              (!invite.expiresAt || new Date(invite.expiresAt) >= new Date())) {

            // Extract role from invite
            const assignedRole = invite.assignedRole;

            // Validate role is one of the allowed values
            if (assignedRole && ['contributor', 'member', 'viewer'].includes(assignedRole)) {
              return {
                role: assignedRole as UserRole,
                reason: 'invite_specified',
                invitedBy: invite.createdBy,
              };
            }

            // If no role specified or invalid role, default to Member
            return {
              role: 'member',
              reason: 'invite_default',
              invitedBy: invite.createdBy,
            };
          }
        }
      } catch (error) {
        console.error('Error validating invite token:', error);
      }
    }
  }

  // Default: non-invited users get Viewer role
  return {
    role: 'viewer',
    reason: 'no_invite_default',
  };
}

// Mark invite as consumed
function consumeInviteToken(inviteToken: string, userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem('amanah_invite_codes');
    if (stored) {
      const inviteCodes = JSON.parse(stored);
      const inviteIndex = inviteCodes.findIndex(
        (i: any) => i.code.toUpperCase() === inviteToken.toUpperCase()
      );

      if (inviteIndex !== -1) {
        inviteCodes[inviteIndex].usedBy = userId;
        inviteCodes[inviteIndex].usedAt = new Date().toISOString();
        localStorage.setItem('amanah_invite_codes', JSON.stringify(inviteCodes));
      }
    }
  } catch (error) {
    console.error('Error consuming invite token:', error);
  }
}

// Register new user
export function register(email: string, password: string, name: string, inviteCode?: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email already registered' };
  }
  
  // Determine role based on context
  const roleAssignment = determineUserRole({
    inviteToken: inviteCode,
    existingUserCount: users.length,
  });
  
  const roleAssignedAt = new Date().toISOString();
  
  // Create new user
  const newUser: AuthUser = {
    id: Date.now().toString(),
    email,
    password, // In production, hash this!
    name,
    role: roleAssignment.role,
    createdAt: new Date().toISOString(),
    roleAssignedAt,
    roleAssignedReason: roleAssignment.reason,
    invitedBy: roleAssignment.invitedBy,
  };
  
  users.push(newUser);
  saveUsers(users);
  
  // Mark invite as consumed if valid invite was used
  if (inviteCode && roleAssignment.invitedBy) {
    consumeInviteToken(inviteCode, newUser.id);
  }
  
  // Auto login
  const user: User = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    createdAt: newUser.createdAt,
    roleAssignedAt: newUser.roleAssignedAt,
    roleAssignedReason: newUser.roleAssignedReason,
  };
  setCurrentUser(user);
  
  return { success: true, user };
}

// Login
export function login(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  const authUser = users.find(u => u.email === email && u.password === password);
  
  if (!authUser) {
    return { success: false, error: 'Invalid email or password' };
  }
  
  const user: User = {
    id: authUser.id,
    email: authUser.email,
    name: authUser.name,
    role: authUser.role || 'member', // Default to member for existing users
    createdAt: authUser.createdAt,
    invitedBy: authUser.invitedBy,
    roleAssignedAt: authUser.roleAssignedAt || authUser.createdAt, // Fallback for existing users
    roleAssignedReason: authUser.roleAssignedReason || 'no_invite_default', // Fallback for existing users
  };
  setCurrentUser(user);
  
  return { success: true, user };
}

// Logout
export function logout(): void {
  setCurrentUser(null);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Update user profile
export function updateProfile(userId: string, updates: { name?: string; email?: string; phone?: string; bio?: string; avatar?: string }): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }
  
  // Check if new email is already taken by another user
  if (updates.email && updates.email !== users[userIndex].email) {
    if (users.find(u => u.email === updates.email && u.id !== userId)) {
      return { success: false, error: 'Email already in use' };
    }
  }
  
  // Update user
  const updatedAuthUser = {
    ...users[userIndex],
    ...updates,
  };
  
  users[userIndex] = updatedAuthUser;
  saveUsers(users);
  
  // Update current user session
  const updatedUser: User = {
    id: updatedAuthUser.id,
    email: updatedAuthUser.email,
    name: updatedAuthUser.name,
    role: updatedAuthUser.role || 'member',
    createdAt: updatedAuthUser.createdAt,
    invitedBy: updatedAuthUser.invitedBy,
    roleAssignedAt: updatedAuthUser.roleAssignedAt || updatedAuthUser.createdAt,
    roleAssignedReason: updatedAuthUser.roleAssignedReason || 'no_invite_default',
  };
  setCurrentUser(updatedUser);
  
  return { success: true, user: updatedUser };
}

// Change password
export function changePassword(userId: string, currentPassword: string, newPassword: string): { success: boolean; error?: string } {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }
  
  // Verify current password
  if (users[userIndex].password !== currentPassword) {
    return { success: false, error: 'Current password is incorrect' };
  }
  
  // Update password
  users[userIndex].password = newPassword; // In production, hash this!
  saveUsers(users);
  
  return { success: true };
}

// Get user profile (including additional fields)
export function getUserProfile(userId: string): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const profiles = localStorage.getItem('amanah_user_profiles');
    const profilesData = profiles ? JSON.parse(profiles) : {};
    return profilesData[userId] || null;
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
}

// Save user profile (additional fields like phone, bio, avatar)
export function saveUserProfile(userId: string, profile: { phone?: string; bio?: string; avatar?: string }): void {
  if (typeof window === 'undefined') return;
  try {
    const profiles = localStorage.getItem('amanah_user_profiles');
    const profilesData = profiles ? JSON.parse(profiles) : {};
    profilesData[userId] = {
      ...profilesData[userId],
      ...profile,
    };
    localStorage.setItem('amanah_user_profiles', JSON.stringify(profilesData));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
}

// Get all users (for admin management)
export function getAllUsers(): User[] {
  const users = getUsers();
  return users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role || 'member',
    createdAt: u.createdAt,
    invitedBy: u.invitedBy,
    roleAssignedAt: u.roleAssignedAt || u.createdAt,
    roleAssignedReason: u.roleAssignedReason || 'no_invite_default',
  }));
}

// Update user role (admin only)
export function updateUserRole(userId: string, newRole: UserRole, currentUserId: string): { success: boolean; error?: string } {
  const users = getUsers();
  const currentUser = users.find(u => u.id === currentUserId);
  
  if (!currentUser) {
    return { success: false, error: 'User not found' };
  }
  
  // Special case: Allow default admin to always change their own role
  const isDefaultAdmin = currentUserId === 'admin-default';
  const isSelfRoleChange = userId === currentUserId;
  const canChangeRole = currentUser.role === 'admin' || (isDefaultAdmin && isSelfRoleChange);
  
  // Check if current user has permission to change roles
  if (!canChangeRole) {
    return { success: false, error: 'Only admins can change user roles' };
  }
  
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return { success: false, error: 'User not found' };
  }
  
  users[userIndex].role = newRole;
  users[userIndex].roleAssignedAt = new Date().toISOString();
  users[userIndex].roleAssignedReason = 'admin_changed';
  saveUsers(users);
  
  // Update current user if they changed their own role
  if (userId === currentUserId) {
    const updatedUser: User = {
      id: users[userIndex].id,
      email: users[userIndex].email,
      name: users[userIndex].name,
      role: users[userIndex].role,
      createdAt: users[userIndex].createdAt,
      invitedBy: users[userIndex].invitedBy,
      roleAssignedAt: users[userIndex].roleAssignedAt,
      roleAssignedReason: users[userIndex].roleAssignedReason,
    };
    setCurrentUser(updatedUser);
  }
  
  return { success: true };
}

// Check if user is admin
export function isAdmin(userId: string): boolean {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  return user?.role === 'admin';
}
