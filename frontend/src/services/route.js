const apiPath = import.meta.env.VITE_API_PATH || '/api/v1';

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: token ? `Bearer ${token}` : '' };
};

const apiRoutes = {
  loginPath: () => `${apiPath}/login`,
  signupPath: () => `${apiPath}/signup`,
  channelsPath: () => `${apiPath}/channels`,
  channelPath: (id) => `${apiPath}/channels/${id}`,
  messagesPath: () => `${apiPath}/messages`,
};

export default apiRoutes;
