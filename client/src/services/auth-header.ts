import authService from './auth.service';

export default function authHeader() {
  const token = authService.getToken();
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  } else {
    return {};
  }
} 