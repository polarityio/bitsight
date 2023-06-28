module.exports = {
  name: 'Bitsight',
  acronym: 'BS',
  description: 'Search Bitsight for Companies and their Security Ratings',
  entityTypes: ['domain'],
  defaultColor: 'light-blue',
  styles: ['./client/styles.less'],
  block: {
    component: {
      file: './client/block.js'
    },
    template: {
      file: './client/block.hbs'
    }
  },
  request: {
    cert: '',
    key: '',
    passphrase: '',
    ca: '',
    proxy: ""
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'apiKey',
      name: 'Company API Key',
      description: 'A Company API Key associated with your Bitsight Instance',
      default: '',
      type: 'password',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
