import { CompanyProfilePage } from 'pages/company-profile';
import { DashboardPage } from 'pages/dashboard';
import DemoPage from 'pages/demo/ui';
import { LoginPage } from 'pages/login';
// import { NotAccessPage } from 'pages/not-access';
import { NotFoundPage } from 'pages/not-found';
import { PolicyPage } from 'pages/policy';
import { SignupPage } from 'pages/signup';
import { UserProfilePage } from 'pages/user-profile';
import { RouteProps } from 'react-router-dom';
import { AppRoutes, RoutePath } from './routes';


export type AppRouteProps = RouteProps & {
  authOnly?: boolean
}


export const routeConfig: Record<AppRoutes, AppRouteProps> = {
  [AppRoutes.ROOT]: {
    path    : RoutePath.ROOT,
    element : <></>
  },
  // Demo
  [AppRoutes.DEMO]: {
    path    : RoutePath.DEMO,
    element : <DemoPage />
  },
  [AppRoutes.DEMO_PROMO]: {
    path    : RoutePath.DEMO,
    element : <DemoPage />
  },

  // Auth
  [AppRoutes.SIGNUP]: {
    path    : RoutePath.SIGNUP,
    element : <SignupPage />
  },
  [AppRoutes.LOGIN]: {
    path    : RoutePath.LOGIN,
    element : <LoginPage />
  },

  [AppRoutes.SLUG]: {
    path    : RoutePath.SLUG,
    element : <></>
  },

  // Profiles
  [AppRoutes.USER_PROFILE]: {
    path    : RoutePath.USER_PROFILE,
    element : <UserProfilePage />
  },
  [AppRoutes.COMPANY_PROFILE]: {
    path    : RoutePath.COMPANY_PROFILE,
    element : <CompanyProfilePage />
  },

  // Dashboard
  [AppRoutes.DASHBOARD]: {
    path    : RoutePath.DASHBOARD,
    element : <DashboardPage />
  },
  [AppRoutes.DASHBOARD_SHEET]: {
    path    : RoutePath.DASHBOARD_SHEET,
    element : <DashboardPage />
  },

  [AppRoutes.POLICY]: {
    path    : RoutePath.POLICY,
    element : <PolicyPage />
  },

  // Others
  // [AppRoutes.NOT_ACCESS]: {
  //   path    : RoutePath.NOT_ACCESS,
  //   element : <NotAccessPage />
  // },
  [AppRoutes.NOT_FOUND]: {
    path    : RoutePath.NOT_FOUND,
    element : <NotFoundPage />
  },
};
