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
