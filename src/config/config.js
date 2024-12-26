const isRunningLocally = () => window.location.hostname === 'localhost';

const HOST_URL = isRunningLocally ? "http://localhost:8000" : '';

const BASE_URL1 = HOST_URL+'/api/auth';
const BASE_URL2 = HOST_URL+'/api/users';
const BASE_URL3 = HOST_URL+'/api/vehicles';

export const POST_LOGIN_DETAILS_URL = `${BASE_URL1}/login`;
export const POST_SIGNUP_DETAILS_URL = `${BASE_URL1}/signup`;
export const GET_LOGIN_DETAILS_URL = `${BASE_URL2}`;