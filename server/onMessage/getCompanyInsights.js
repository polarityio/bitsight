const { get, orderBy, map, flow, first, isString } = require('lodash/fp');
const { getLogger } = require('../logging');
const { requestWithDefaults } = require('../request');
const { parseErrorToReadableJson } = require('../dataTransformations');

const getCompanyInsights = async ({ companyGuid }, options, callback) => {
  const Logger = getLogger();
  try {
    let companyInsights = get(
      'body',
      await requestWithDefaults({
        route: 'insights',
        qs: {
          company: companyGuid,
          score_delta_lt: 0
        },
        options
      })
    );

    let highestRating;
    let lowestRating;
    if (!isString(companyInsights)) {
      const companyInsightsWithScoreChange = map(
        (insight) => ({
          ...insight,
          scoreChange: Math.abs(insight.start_score - insight.end_score),
          scoreChangeType: insight.start_score < insight.end_score ? 'rise' : 'drop'
        }),
        companyInsights
      );

      companyInsights = companyInsightsWithScoreChange;

      highestRating = getHighestLowest(companyInsights, 'desc');

      lowestRating = getHighestLowest(companyInsights, 'asc');
    }

    Logger.trace(
      { companyInsights, highestRating, lowestRating },
      'Company Insights Lookup Successful'
    );

    callback(null, { companyInsights, highestRating, lowestRating });
  } catch (error) {
    const err = parseErrorToReadableJson(error);
    Logger.error(
      {
        detail: 'Failed Company Insights Lookup',
        options,
        formattedError: err
      },
      'Company Insights Lookup Failed'
    );
    return callback({
      errors: [
        {
          err: error,
          detail: error.message || 'Company Insights Lookup Failed'
        }
      ]
    });
  }
};

const getHighestLowest = (companyInsights, sortOrder) =>
  flow(
    orderBy(
      (insight) =>
        insight.start_score > insight.end_score ? insight.start_score : insight.end_score,
      sortOrder
    ),
    first,
    ({ start_score, end_score, ...insight }) => ({
      ...insight,
      start_score,
      end_score,
      score:
        sortOrder === 'asc'
          ? start_score > end_score
            ? start_score
            : end_score
          : start_score < end_score
          ? start_score
          : end_score
    })
  )(companyInsights);

module.exports = getCompanyInsights;
