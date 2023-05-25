const { flow, get, size, find, eq, map, some } = require('lodash/fp');

const assembleLookupResults = (entities, companies, options) =>
  map((entity) => {
    const resultsForThisEntity = getResultsForThisEntity(
      entity,
      companies,
      options
    );

    const resultsFound = some(size, resultsForThisEntity);

    const lookupResult = {
      entity,
      data: resultsFound
        ? {
            summary: createSummaryTags(resultsForThisEntity, options),
            details: resultsForThisEntity
          }
        : null
    };

    return lookupResult;
  }, entities);

const getResultForThisEntity = (entity, results) =>
  flow(find(flow(get('entity.value'), eq(entity.value))), get('result'))(results);

const getResultsForThisEntity = (
  entity,
  companies
) => {
  return {
    companies: getResultForThisEntity(entity, companies)
  };
};

const createSummaryTags = ({companies}, options) => {
  // TODO
  return [].concat([]);
};

module.exports = assembleLookupResults;
