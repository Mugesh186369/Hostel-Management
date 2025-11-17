// Authentication functions using Express.js API

// Register user
async function registerUser(userId, name, email, password, role, roomNumber) {
  try {
    const response = await authAPI.register({
      userId,
      name,
      email,
      password,
      roomNumber: role === 'student' ? roomNumber : ''
    });

    if (response.token) {
      setAuthToken(response.token);
      setUser(response.user);
    }

    return response.user;
  } catch (error) {
    throw new Error(error.message || 'Registration failed. Please try again.');
  }
}

// Login user
async function loginUser(email, password, role, userId) {
  try {
    const response = await authAPI.login(email, password, userId, role);

    if (response.token) {
      setAuthToken(response.token);
      setUser(response.user);

      // Redirect based on role
      if (role === 'student') {
        window.location.href = '/student/dashboard';
      } else {
        window.location.href = '/admin/dashboard';
      }
    }
  } catch (error) {
    throw new Error(error.message || 'Login failed. Please check your credentials.');
  }
}

// Get current user
function getCurrentUser() {
  return getUser();
}

// Logout user
function logout() {
  removeAuthToken();
  disconnectSocket();
  window.location.href = '/';
}

// Check if user is authenticated
function checkAuth(requiredRole = null) {
  const user = getCurrentUser();
  const token = getAuthToken();

  if (!user || !token) {
    window.location.href = '/';
    return false;
  }

  if (requiredRole && user.role !== requiredRole) {
    window.location.href = '/';
    return false;
  }

  return user;
}

// Verify token on page load
async function verifyAuth() {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  try {
    const response = await authAPI.verify();
    if (response.user) {
      setUser(response.user);
      return response.user;
    }
    return null;
  } catch (error) {
    removeAuthToken();
    return null;
  }
}

// Export functions
window.registerUser = registerUser;
window.loginUser = loginUser;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.checkAuth = checkAuth;
window.verifyAuth = verifyAuth;

