module.exports = {
  name: 'BitSight',
  acronym: 'BS',
  description: 'TODO',
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
    proxy: '',
    rejectUnauthorized: true
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  options: [
    {
      key: 'clientId',
      name: 'Azure AD Registered App Client/Application ID',
      description:
        "TODO",
      default: '',
      type: 'text',
      userCanEdit: false,
      adminOnly: true
    }
  ]
};
