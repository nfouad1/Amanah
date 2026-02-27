// Simple authentication system using localStorage
// In production, this would be replaced with proper backend authentication

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthUser extends User {
  password: string; // Hashed in production
}

// Get all users
function getUsers(): AuthUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('amanah_users');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
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

// Register new user
export function register(email: string, password: string, name: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'Email already registered' };
  }
  
  // Create new user
  const newUser: AuthUser = {
    id: Date.now().toString(),
    email,
    password, // In production, hash this!
    name,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  saveUsers(users);
  
  // Auto login
  const user: User = {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    createdAt: newUser.createdAt,
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
    createdAt: authUser.createdAt,
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
    createdAt: updatedAuthUser.createdAt,
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
