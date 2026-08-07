export const API_PATHS = {
  auth: {
    login: {
      byEmail            : '/auth/login/byEmail',
      resetEmailPassword : '/auth/login/resetEmailPassword',
    },
    signup: {
      byEmailStart  : '/auth/signup/byEmailStart',
      sendCodeAgain : '/auth/signup/sendCodeAgain',
      byEmailEnd    : '/auth/signup/byEmailEnd',
    },
  },
  user: {
    getAuth               : '/user/getAuth',
    // getStartResourseData  : '/user/getStartResourseData',
    update                : '/user/update',
    sendEmailConfirmation : '/user/sendEmailConfirmation',
    logout                : '/user/logout',
  },
  company: {
    // get    : '/company/get',
    update      : '/company/update',
    deleteSheet : '/company/deleteSheet',
    // deleteCompany : '/deleteCompany/:companyId',
  },
  paramsCompany: {
    get    : '/paramsCompany/get',
  },
  dashboard: {
    bunch:  {
      get    : '/dashboard/bunch/get',
    },
    view: {
      createGroupItems : '/dashboard/view/createGroupItems',
      // get              : '/dashboard/view/get', // Get all ViewItemsByCompanyId
      update           : '/dashboard/view/update',
      delete           : '/dashboard/view/delete',
    },
  },
  templates: {
    getBunchesUpdated : '/templates/getBunchesUpdated',
    getTemplates      : '/templates/getTemplates',
    update            : '/templates/update',
    delete            : '/templates/delete',
  },
  docs: {
    getPolicy: '/getPolicy',
  },
  google: {
    getData: '/getData',
  },
  partner: {
    increaseFollower: '/increaseFollower'
  },
  transactions: {
    sendTransactions: '/sendTransactions',
  }
};
