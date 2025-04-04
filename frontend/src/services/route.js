const apiPath = '/api/v1';

const apiRoutes = {
  loginPath: () => `${apiPath}/login`,
  signupPath: () => `${apiPath}/signup`,
  channelsPath: () => `${apiPath}/channels`,
  channelPath: (id) => `${apiPath}/channels/${id}`,
  messagesPath: () => `${apiPath}/messages`,
  messagePath: (id) => `${apiPath}/messages/${id}`,
};

export default apiRoutes;
