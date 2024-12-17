const isRunningLocally = () => window.location.hostname === 'localhost';

const HOST_URL = isRunningLocally ? "http://localhost:8000" : '';

const BASE_URL = `${HOST_URL}/api`;

export const POST_LOGIN_DETAILS_URL = `${BASE_URL}/auth/login`;