const { getCompanies } = require('./queries');

const searchEntities = async (entities, options) => {
  const companies = await getCompanies(entities, options);

  return { companies };
};

module.exports = searchEntities;
