import { memo, Suspense, useCallback } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppRoutes, RoutePath } from '../config';
import { RootPage } from 'pages/root';
import { PageLoader } from 'widgets/page-loader';
import { NotFoundPage } from 'pages/not-found';
import { CompanyProfilePage } from 'pages/company-profile';
import { DashboardPage } from 'pages/dashboard';
import { MainLayout } from '../../../layouts';
import { CompanyPage } from 'pages/company';
// import { RequireAuth } from '../require-auth';
import { SignupPage } from 'pages/signup';
import { LoginPage } from 'pages/login';
import { UserProfilePage } from 'pages/user-profile';
// import { NotAccessPage } from 'pages/not-access';
import { PolicyPage } from 'pages/policy';
import { DemoPage } from 'pages/demo';



export const AppRouter = memo(() => {
  const withFallback = useCallback((element: JSX.Element) => (
    <Suspense fallback={<PageLoader loading />}>
      {element}
    </Suspense>
  ), []);

  // const renderWithWrapper = useCallback(({ path, element, authOnly }: AppRouteProps) => {
  //   const component = (
  //     <Suspense fallback={<PageLoader loading />}>
  //       {element}
  //     </Suspense>
  //   );

  //   // skip AppRoutes.ROOT
  //   if (path === AppRoutes.ROOT) return null

  //   return (
  //     <Route
  //       key     = {path}
  //       path    = {path}
  //       element = {component}
  //     />
  //   )
  // }, []);


  return (
    <Routes>
      <Route path={RoutePath[AppRoutes.ROOT]} element={<MainLayout />}>
        <Route index element={<RootPage />} />
        <Route path={RoutePath[AppRoutes.DEMO]} element={withFallback(<DemoPage />)} />
        <Route path={RoutePath[AppRoutes.DEMO_PROMO]} element={withFallback(<DemoPage />)} />

        <Route path={RoutePath[AppRoutes.SIGNUP]} element={withFallback(<SignupPage />)} />
        <Route path={RoutePath[AppRoutes.LOGIN]} element={withFallback(<LoginPage />)} />
        <Route path={RoutePath[AppRoutes.POLICY]} element={withFallback(<PolicyPage />)} />

        <Route path={RoutePath[AppRoutes.USER_PROFILE]} element={withFallback(<UserProfilePage />)} />
        <Route path={RoutePath[AppRoutes.COMPANY_PROFILE]} element={withFallback(<CompanyProfilePage />)} />
        {/* <Route path={RoutePath[AppRoutes.NOT_ACCESS]} element={<NotAccessPage />} /> */}

        <Route path={RoutePath[AppRoutes.SLUG]} element={withFallback(<CompanyPage />)}>
          {/* <RequireAuth></RequireAuth> */}

          {/* <Route index element={<CompanyPage />} /> */}
          <Route path={RoutePath[AppRoutes.DASHBOARD]} element={withFallback(<DashboardPage />)} />
          <Route path={RoutePath[AppRoutes.DASHBOARD_SHEET]} element={withFallback(<DashboardPage />)} />

        </Route>
        {/* Перехват неправильных путей */}
        <Route path='dashboard/*' element={<Navigate to={RoutePath[AppRoutes.ROOT]} replace />} />
        <Route path={RoutePath[AppRoutes.NOT_FOUND]} element={<NotFoundPage />} />

        {/* {
          Object
            .values(routeConfig)
            .map(renderWithWrapper)
        } */}
      </Route>

    </Routes>
  );
});
