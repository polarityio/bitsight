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
    const outerThis = this;

    outerThis.set(
      'getCompanyInsightsErrorMessage',
      Object.assign({}, outerThis.get('getCompanyInsightsErrorMessage'), { [index]: '' })
    );
    outerThis.set(
      'getCompanyInsightsIsRunning',
      Object.assign({}, outerThis.get('getCompanyInsightsIsRunning'), { [index]: true })
    );

    outerThis
      .sendIntegrationMessage({ action: 'getCompanyInsights', data: { companyGuid } })
      .then(({ companyInsights, highestRating, lowestRating }) => {
        outerThis.set(
          'companyInsightsStates',
          Object.assign({}, outerThis.get('companyInsightsStates'), {
            [index]: companyInsights
          })
        );
        outerThis.set(
          'expandableTitleStates',
          Object.assign({}, outerThis.get('expandableTitleStates'), { [index]: true })
        );
        outerThis.set(
          'highestRatingInsightsStates',
          Object.assign({}, outerThis.get('expandableTitleStates'), {
            [index]: highestRating
          })
        );
        outerThis.set(
          'lowestRatingInsightsStates',
          Object.assign({}, outerThis.get('expandableTitleStates'), {
            [index]: lowestRating
          })
        );
      })
      .catch((err) => {
        outerThis.set(
          `getCompanyInsightsErrorMessage`,
          Object.assign({}, outerThis.get('getCompanyInsightsErrorMessage'), {
            [index]:
              (err &&
                (err.detail || err.err || err.message || err.title || err.description)) ||
              'Unknown Reason'
          })
        );
      })
      .finally(() => {
        outerThis.set(
          'getCompanyInsightsIsRunning',
          Object.assign({}, outerThis.get('getCompanyInsightsIsRunning'), {
            [index]: false
          })
        );
        outerThis.get('block').notifyPropertyChange('data');
        setTimeout(() => {
          if (outerThis.get(`getCompanyInsightsErrorMessage.${index}`)) {
            outerThis.set(
              `getCompanyInsightsErrorMessage`,
              Object.assign({}, outerThis.get('getCompanyInsightsErrorMessage'), {
                [index]: ''
              })
            );
            outerThis.set(
              `expandableTitleStates`,
              Object.assign({}, outerThis.get('expandableTitleStates'), {
                [index]: false
              })
            );
          }
          outerThis.get('block').notifyPropertyChange('data');
        }, 5000);
      });
  },
  actions: {
    toggleExpandableTitle: function (index, companyGuid) {
      this.set(
        `expandableTitleStates`,
        Object.assign({}, this.get('expandableTitleStates'), {
          [index]: !this.get('expandableTitleStates')[index]
        })
      );
      if (!this.get('companyInsightsStates')[index])
        this.getCompanyInsights(index, companyGuid);

      this.get('block').notifyPropertyChange('data');
    }
  }
});
