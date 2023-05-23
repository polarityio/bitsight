const { map, replace } = require('lodash/fp');
const { splitCommaSeparatedUserOption } = require('./utils');

const parseUserOptions = (options) => ({
  ...options,
});

module.exports = parseUserOptions;
