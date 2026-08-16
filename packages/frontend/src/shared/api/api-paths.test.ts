import { API_PATHS } from './api-paths';

/** Рекурсивно собирает все строковые значения путей из вложенного объекта конфигурации */
const collectPaths = (node: unknown, acc: string[] = []): string[] => {
  if (typeof node === 'string') {
    acc.push(node);
    return acc;
  }

  if (node && typeof node === 'object') {
    Object.values(node).forEach((value) => collectPaths(value, acc));
  }

  return acc;
};

describe('API_PATHS', () => {
  it('auth endpoints соответствуют глоссарию', () => {
    expect(API_PATHS.auth.login.byEmail).toBe('/auth/login/byEmail');
    expect(API_PATHS.auth.login.resetEmailPassword).toBe('/auth/login/resetEmailPassword');
    expect(API_PATHS.auth.signup.byEmailStart).toBe('/auth/signup/byEmailStart');
    expect(API_PATHS.auth.signup.sendCodeAgain).toBe('/auth/signup/sendCodeAgain');
    expect(API_PATHS.auth.signup.byEmailEnd).toBe('/auth/signup/byEmailEnd');
  });

  it('user endpoints соответствуют глоссарию', () => {
    expect(API_PATHS.user.getAuth).toBe('/user/getAuth');
    expect(API_PATHS.user.update).toBe('/user/update');
    expect(API_PATHS.user.sendEmailConfirmation).toBe('/user/sendEmailConfirmation');
    expect(API_PATHS.user.logout).toBe('/user/logout');
  });

  it('company endpoints соответствуют глоссарию', () => {
    expect(API_PATHS.company.update).toBe('/company/update');
    expect(API_PATHS.company.deleteSheet).toBe('/company/deleteSheet');
  });

  it('paramsCompany endpoint соответствует глоссарию', () => {
    expect(API_PATHS.paramsCompany.get).toBe('/paramsCompany/get');
  });

  it('dashboard endpoints соответствуют глоссарию', () => {
    expect(API_PATHS.dashboard.bunch.get).toBe('/dashboard/bunch/get');
    expect(API_PATHS.dashboard.view.createGroupItems).toBe('/dashboard/view/createGroupItems');
    expect(API_PATHS.dashboard.view.update).toBe('/dashboard/view/update');
    expect(API_PATHS.dashboard.view.delete).toBe('/dashboard/view/delete');
  });

  it('templates endpoints соответствуют глоссарию', () => {
    expect(API_PATHS.templates.getBunchesUpdated).toBe('/templates/getBunchesUpdated');
    expect(API_PATHS.templates.getTemplates).toBe('/templates/getTemplates');
    expect(API_PATHS.templates.update).toBe('/templates/update');
    expect(API_PATHS.templates.delete).toBe('/templates/delete');
  });

  it('docs/google/partner endpoints соответствуют глоссарию', () => {
    expect(API_PATHS.docs.getPolicy).toBe('/getPolicy');
    expect(API_PATHS.google.getData).toBe('/getData');
    expect(API_PATHS.partner.increaseFollower).toBe('/increaseFollower');
  });

  it('все пути начинаются с "/" и не содержат префикс "/api"', () => {
    const paths = collectPaths(API_PATHS);
    expect(paths.length).toBeGreaterThan(0);

    paths.forEach((path) => {
      expect(path.startsWith('/')).toBe(true);
      expect(path.includes('/api')).toBe(false);
    });
  });
});
