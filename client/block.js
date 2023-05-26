polarity.export = PolarityComponent.extend({
  details: Ember.computed.alias('block.data.details'),
  timezone: Ember.computed('Intl', function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  getCompanyInsightsErrorMessage: {},
  getCompanyInsightsIsRunning: {},
  expandableTitleStates: {},
  companyInsightsStates: {},
  highestRatingInsightsStates: {},
  lowestRatingInsightsStates: {},
  getCompanyInsights: function (index, companyGuid) {
    this.set(`getCompanyInsightsErrorMessage.${index}`, '');
    this.set(`getCompanyInsightsIsRunning.${index}`, true);

    this.sendIntegrationMessage({ action: 'getCompanyInsights', data: { companyGuid } })
      .then(({ companyInsights, highestRating, lowestRating }) => {
        this.set(`companyInsightsStates.${index}`, companyInsights);
        this.set(`expandableTitleStates.${index}`, true);
        this.set(`highestRatingInsightsStates.${index}`, highestRating);
        this.set(`lowestRatingInsightsStates.${index}`, lowestRating);
      })
      .catch((err) => {
        this.set(
          `getCompanyInsightsErrorMessage.${index}`,
          (err &&
            (err.detail || err.err || err.message || err.title || err.description)) ||
            'Unknown Reason'
        );
      })
      .finally(() => {
        this.set(`getCompanyInsightsIsRunning.${index}`, false);

        setTimeout(() => {
          if (!this.isDestroyed && this.get(`getCompanyInsightsErrorMessage.${index}`)) {
            this.set(`getCompanyInsightsErrorMessage.${index}`, '');
            this.set(`expandableTitleStates.${index}`, false);
          }
        }, 5000);
      });
  },
  actions: {
    toggleExpandableTitle: function (index, companyGuid) {
      this.set(
        `expandableTitleStates.${index}`,
        !this.get(`expandableTitleStates.${index}`)
      );
      if (!this.get('companyInsightsStates')[index])
        this.getCompanyInsights(index, companyGuid);
    }
  }
});
