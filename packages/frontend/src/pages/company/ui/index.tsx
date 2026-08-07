import { FC, memo, useEffect } from 'react';
import { useUser } from 'entities/user';
import { Outlet, useParams } from 'react-router-dom';
import { useAccess, useCompany } from 'entities/company';
import { useUI } from 'entities/ui';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { usePages } from 'shared/lib/hooks';
import { isNotEmpty } from 'shared/helpers/objects';



const CompanyPage: FC = memo((): JSX.Element | null => {
  const { companyId: urlParamsCompanyId } = useParams();
  const { _isLoaded, loading: loadingUser, auth, errors: userErrors } = useUser();
  const { setPageLoading, setWarningMessage } = useUI();
  const { dashboardSheetId } = usePages();
  const {
    loading: loadingCompany, paramsCompanyId, companyId, dashboardPublicAccess, _isParamsCompanyIdLoaded,
    errors: companyErrors, serviceGetParamsCompany, setIsParamsCompanyIdLoaded
  } = useCompany({ dashboardSheetId });
  const { isDashboardAccessView } = useAccess();


  useEffect(() => {
    if ((isNotEmpty(userErrors) && ! isDashboardAccessView) || isNotEmpty(companyErrors)) {
      return
    }

    if (! auth
      && ! _isLoaded
      && ! loadingUser
    ) {
      setPageLoading({
        'get-auth': { text: 'Авторизация...', name: 'CompanyPage' }
      });
    }
    // Если по ссылке вошли в чужую компанию
    else if (
      // auth && // должна быть возможность входить неавторизованным пользователям
         _isLoaded
      && ! loadingUser
      && ! loadingCompany
      && ! _isParamsCompanyIdLoaded
      && urlParamsCompanyId
      && urlParamsCompanyId !== companyId
    ) {
      setPageLoading({ 'get-params-company': { text: 'Загрузка данных по компании...', name: 'CompanyPage' } });
      serviceGetParamsCompany({ companyId: urlParamsCompanyId, dashboardSheetId });
    }
    // Если переключились на другую компанию, напр. Демо-примеры
    else if (
         _isLoaded
      && ! loadingUser
      && ! loadingCompany
      && urlParamsCompanyId
      && urlParamsCompanyId !== paramsCompanyId
    ) {
      setPageLoading({ 'get-params-company': { text: 'Загрузка данных по компании...', name: 'CompanyPage' } });
      serviceGetParamsCompany({ companyId: urlParamsCompanyId, dashboardSheetId });
    }
    // Если по ссылке вошли в свою компанию
    else if (
         _isLoaded
      && ! loadingUser
      && ! loadingCompany
      && urlParamsCompanyId === companyId
      && ! _isParamsCompanyIdLoaded
    ) {
      setIsParamsCompanyIdLoaded(true);
    }
    else if (! auth
      && _isLoaded
      && _isParamsCompanyIdLoaded
      && ! dashboardPublicAccess
    ) {
      __devLog('CompanyPage', 'NOT AUTHORIZED & NOT ACCESS');
      setWarningMessage('У вас нет доступа к этой странице. Возможно, необходимо авторизоваться.');
    }
    else if (auth
      && _isLoaded
      && _isParamsCompanyIdLoaded
      && ! isDashboardAccessView
    ) {
      __devLog('CompanyPage', 'AUTHORIZED & NOT ACCESS');
      setWarningMessage('У вас нет доступа к этой странице.');
    }
  },
    [
      loadingUser, _isLoaded, loadingCompany, auth, dashboardSheetId, dashboardPublicAccess, isDashboardAccessView,
      _isParamsCompanyIdLoaded, urlParamsCompanyId, companyId, paramsCompanyId, userErrors, companyErrors,
      setWarningMessage, serviceGetParamsCompany, setIsParamsCompanyIdLoaded, setPageLoading
    ]
  );


  if (! isDashboardAccessView || ! _isParamsCompanyIdLoaded) {
      __devLog('CompanyPage', 'RETURN NULL');
    return null;
  }

  return (
    <Outlet />
  );
});


export default CompanyPage;
