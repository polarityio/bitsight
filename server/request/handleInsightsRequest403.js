const handleInsightsRequest403 = async (error, requestOptions) => {
  if (error.status === 403) return { body: "You don't have access to this resource" };
  throw error;
};

module.exports = handleInsightsRequest403;