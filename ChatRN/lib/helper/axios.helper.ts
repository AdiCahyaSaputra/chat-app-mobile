// import { PUBLIC_BACKEND_URL } from '@env';
import Axios from 'axios';

export const BACKEND_URL = 'http://192.168.169.111:8000';

const axios = Axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true,
});

export default axios;
