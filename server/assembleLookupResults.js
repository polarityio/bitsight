const { flow, get, size, find, eq, map, some, sum } = require('lodash/fp');

const assembleLookupResults = (entities, companies, options) =>
  map((entity) => {
    const resultsForThisEntity = getResultsForThisEntity(entity, companies, options);

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

const getResultsForThisEntity = (entity, companies) => {
  return {
    companies: getResultForThisEntity(entity, companies)
  };
};

const createSummaryTags = ({ companies }, options) => {
  const totalUsersSearched = getAggregateFieldCount(
    'details.search_history_count',
    companies
  );
  const totalMonitors = getAggregateFieldCount(
    'details.customer_monitoring_count',
    companies
  );
  return []
    .concat(size(companies) ? `Companies Found: ${size(companies)}` : [])
    .concat(totalUsersSearched ? `Total Users Searched: ${totalUsersSearched}` : [])
    .concat(totalMonitors ? `Total Monitors: ${totalMonitors}` : []);
};

const getAggregateFieldCount = (fieldPath, companies) =>
  flow(map(get(fieldPath)), sum)(companies);
  
module.exports = assembleLookupResults;
