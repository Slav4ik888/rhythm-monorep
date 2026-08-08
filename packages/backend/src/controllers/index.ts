// packages/backend/src/controllers/index.ts

import auth from './auth';
import user from './user';
import company from './company';
import paramsCompany from './params-company';
import dashboard from './dashboard';
import docs from './docs';
import google from './google';
import logs from './loggers';
import templates from './templates';
import partner from './partner';

export default {
  auth,
  user,
  company,
  dashboard,
  paramsCompany,
  docs,
  google,
  templates,
  logs,
  partner,
};
