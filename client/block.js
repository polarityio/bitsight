polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  getCompanyInsightsErrorMessage: Ember.computed.alias(
    'block._state.getCompanyInsightsErrorMessage'
  ),
  getCompanyInsightsIsRunning: Ember.computed.alias(
    'block._state.getCompanyInsightsIsRunning'
  ),
  expandableTitleStates: Ember.computed.alias('block._state.expandableTitleStates'),
  companyInsightsStates: Ember.computed.alias('block._state.companyInsightsStates'),
  highestRatingInsightsStates: Ember.computed.alias(
    'block._state.highestRatingInsightsStates'
  ),
  lowestRatingInsightsStates: Ember.computed.alias(
    'block._state.lowestRatingInsightsStates'
  ),
  init: function () {
    if (!this.get('block._state')) {
      this.set('block._state', {});
      this.set('block._state.getCompanyInsightsErrorMessage', {});
      this.set('block._state.getCompanyInsightsIsRunning', {});
      this.set('block._state.expandableTitleStates', {});
      this.set('block._state.companyInsightsStates', {});
      this.set('block._state.highestRatingInsightsStates', {});
      this.set('block._state.lowestRatingInsightsStates', {});
    }
    this._super(...arguments);
  },
  getCompanyInsights: function (index, companyGuid) {
    this.set(`block._state.getCompanyInsightsErrorMessage.${index}`, '');
    this.set(`block._state.getCompanyInsightsIsRunning.${index}`, true);

    this.sendIntegrationMessage({ action: 'getCompanyInsights', data: { companyGuid } })
      .then(({ companyInsights, highestRating, lowestRating }) => {
        this.set(`block._state.companyInsightsStates.${index}`, companyInsights);
        this.set(`block._state.expandableTitleStates.${index}`, true);
        this.set(`block._state.highestRatingInsightsStates.${index}`, highestRating);
        this.set(`block._state.lowestRatingInsightsStates.${index}`, lowestRating);
      })
      .catch((err) => {
        this.set(
          `block._state.getCompanyInsightsErrorMessage.${index}`,
          (err &&
            (err.detail || err.err || err.message || err.title || err.description)) ||
            'Unknown Reason'
        );
      })
      .finally(() => {
        this.set(`block._state.getCompanyInsightsIsRunning.${index}`, false);

        setTimeout(() => {
          if (
            !this.isDestroyed &&
            this.get(`block._state.getCompanyInsightsErrorMessage.${index}`)
          ) {
            this.set(`block._state.getCompanyInsightsErrorMessage.${index}`, '');
            this.set(`block._state.expandableTitleStates.${index}`, false);
          }
        }, 5000);
      });
  },
  actions: {
    toggleExpandableTitle: function (index, companyGuid) {
      this.set(
        `block._state.expandableTitleStates.${index}`,
        !this.get(`block._state.expandableTitleStates.${index}`)
      );
      if (!this.get('block._state.companyInsightsStates')[index])
        this.getCompanyInsights(index, companyGuid);
    }
  }
});
