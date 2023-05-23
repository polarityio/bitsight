const { flow, get, size, find, eq, map, some } = require('lodash/fp');

const assembleLookupResults = (entities, alerts, incidents, kustoQueryResults, options) =>
  map((entity) => {
    const resultsForThisEntity = getResultsForThisEntity(
      entity,
      alerts,
      incidents,
      kustoQueryResults,
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
  //todo
  options
) => {
  return {
    // todo
  };
};

const createSummaryTags = ({}, options) => {
  return [].concat([]).concat();
};

module.exports = assembleLookupResults;
