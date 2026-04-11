export function getStoredUser() {
  const rawUser = localStorage.getItem('user');

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function hasAuthToken() {
  return Boolean(localStorage.getItem('token'));
}

export function isGuestUser() {
  return getStoredUser()?.role === 'guest';
}

export function hasMemberAccess() {
  const user = getStoredUser();
  return hasAuthToken() && Boolean(user) && user.role !== 'guest';
}

export function isAdminUser() {
  return getStoredUser()?.role === 'admin' && hasAuthToken();
}

export function isStudentUser() {
  return getStoredUser()?.role === 'student' && hasAuthToken();
}

export function setGuestSession() {
  localStorage.removeItem('token');
  localStorage.setItem('user', JSON.stringify({
    id: 'guest-user',
    name: 'Guest User',
    email: null,
    role: 'guest',
  }));
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}