import Axios from 'axios';
import * as Sentry from '@sentry/browser';
import { env } from '@/environments';

const api = Axios.create({
  baseURL: env.baseUrl,
  timeout: 30000,
  withCredentials: true,
});

api.defaults.headers.common.Accept = 'application/json';
api.defaults.headers.common['Content-Type'] = 'application/json';

const saveTokens = (tokens) => {
  localStorage.setItem('tokensData', tokens);
};

export const authorizeUser = ({ username, password }) => api
  .post('api/auth', { username, password })
  .then((response) => {
    if (response.status === 200) {
      saveTokens(JSON.stringify(response));
      return Promise.resolve(response);
    }
    return Promise.reject(new Error('Authorization failed'));
  });

export const refreshTokens = (token) => api
  .post('api/auth/refreshToken', token)
  .then((response) => {
    if (response.status === 200) {
      saveTokens(JSON.stringify(response));
      return Promise.resolve(response);
    }
    return Promise.reject(new Error('Token refresh failed'));
  });

api.interceptors.request.use(
  async (conf) => {
    const tokensData = JSON.parse(localStorage.tokensData);

    if (tokensData) {
      if (Date.now() >= tokensData.expires_on * 1000) {
        const newToken = await refreshTokens(tokensData.refresh_token);
        saveTokens(JSON.stringify(newToken));
      }

      api.defaults.headers.common.Authorization = `Token ${tokensData.access_token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
    return conf;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      const accessToken = await refreshTokens();
      api.defaults.headers.common.Authorization = `Token ${accessToken}`;
      return api(error.config);
    }
    const path = error.config.url;
    Sentry.captureMessage(new Error(`🤬 ${error.config.method} ${path} 🤯`), {
      extra: {
        path: error.config.url,
        method: error.config.method,
        body: error.config.data,
      },
      fingerprint: ['{{ default }}', error.config.url],
    });
    return Promise.reject(error);
  },
);

export const testRequest = () => api.get('todos/');
