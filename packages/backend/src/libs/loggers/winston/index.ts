import path from 'path';
import winston from 'winston';

const
  { createLogger, format, transports } = winston,
  { combine, timestamp, label, printf } = format,
  rootPath = '../../../logs/';


interface PrintF { [k: string]: string };

const myFormat = printf(({ level, message, label, timestamp }: PrintF) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});


const loggerServer = createLogger({
  level: 'info',
  // format: winston.format.json(),
  format: combine(
    // format.json(),
    label({ label: 'server' }),
    timestamp(),
    myFormat
  ),
  // defaultMeta: {service: 'course-service'},
  transports: [
    // сюда будут попадать ошибки уровня error
    new transports.File({ filename: path.join(__dirname, rootPath, 'errors.log'), level: 'error' }),
    // Сюда будет валиться всё
    new transports.File({ filename: path.join(__dirname, rootPath, 'server.log') })
  ]
});

const loggerApp = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'app' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, rootPath, 'errors.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, rootPath, 'app.log') })
  ]
});

const loggerAuth = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'auth' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, rootPath, 'errors.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, rootPath, 'auth.log') })
  ]
});

const loggerLogin = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'login' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, rootPath, 'errors.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, rootPath, 'login.log') })
  ]
});

const loggerSignup = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'signup' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, rootPath, 'errors.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, rootPath, 'signup.log') })
  ]
});

const loggerUser = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'user' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, rootPath, 'errors.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, rootPath, 'user.log') })
  ]
});

const loggerCompany = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'company' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, rootPath, 'errors.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, rootPath, 'company.log') })
  ]
});

const loggerMail = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'mails' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, rootPath, 'errors.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, rootPath, 'mails.log') })
  ]
});

const loggerDocs = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'docs' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, rootPath, 'errors.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, rootPath, 'docs.log') })
  ]
});

const loggerDashboardView = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'dashboardView' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, rootPath, 'errors.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, rootPath, 'dashboardView.log') })
  ]
});

const loggerDashboardTemplates = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'dashboardTemplates' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, rootPath, 'errors.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, rootPath, 'dashboardTemplates.log') })
  ]
});

const loggerPartner = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'partner' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, rootPath, 'errors.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, rootPath, 'partner.log') })
  ]
});

const loggerUrl = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'url' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, rootPath, 'errors.log'), level: 'error' }),
    new transports.File({ filename: path.join(__dirname, rootPath, 'url.log') })
  ]
});


if (process.env.NODE_ENV !== 'production') {
  loggerServer             .add(new transports.Console({ format: combine(format.colorize(), format.simple()) }));
  loggerApp                .add(new transports.Console({ format: combine(format.colorize(), format.simple()) }));
  loggerAuth               .add(new transports.Console({ format: combine(format.colorize(), format.simple()) }));
  loggerLogin              .add(new transports.Console({ format: combine(format.colorize(), format.simple()) }));
  loggerSignup             .add(new transports.Console({ format: combine(format.colorize(), format.simple()) }));
  loggerUser               .add(new transports.Console({ format: combine(format.colorize(), format.simple()) }));
  loggerCompany            .add(new transports.Console({ format: combine(format.colorize(), format.simple()) }));
  loggerDocs               .add(new transports.Console({ format: combine(format.colorize(), format.simple()) }));
  loggerMail               .add(new transports.Console({ format: combine(format.colorize(), format.simple()) }));
  loggerDashboardView      .add(new transports.Console({ format: combine(format.colorize(), format.simple()) }));
  loggerDashboardTemplates .add(new transports.Console({ format: combine(format.colorize(), format.simple()) }));
  loggerUrl                .add(new transports.Console({ format: combine(format.colorize(), format.simple()) }));
  loggerPartner            .add(new transports.Console({ format: combine(format.colorize(), format.simple()) }));
}


export {
  loggerServer, loggerApp, loggerAuth, loggerLogin, loggerSignup, loggerUser, loggerCompany, loggerMail,
  loggerDashboardView, loggerDocs, loggerDashboardTemplates, loggerUrl, loggerPartner
};
