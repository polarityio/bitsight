const authenticateRequest = async ({ route, options, ...requestOptions }) => ({
    ...requestOptions,
    url: `${options.url}/${route}`,
    auth: {
      username: options.apiKey
    }
  })

module.exports = authenticateRequest;
