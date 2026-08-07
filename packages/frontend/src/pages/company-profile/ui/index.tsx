import { FC, memo, useCallback, useEffect, useState, ChangeEvent } from 'react';
import { useUser } from 'entities/user';
import { CompanyProfilePageComponent } from './component';
import { useUI } from 'entities/ui';
import { PartialCompany, useCompany, Company, validateCompanyData } from 'entities/company';
import { cloneObj, getChanges, isEmpty, setValueByScheme } from 'shared/helpers/objects';
import { creatorFixDate } from 'entities/base';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { AppRoutes, RoutePath } from 'app/providers/routes';
import { useNavigate } from 'react-router-dom';



const CompanyProfilePage: FC = memo(() => {
  const { auth, userId } = useUser();
  const { loading, errors, paramsCompany: storedCompany, setErrors, serviceUpdateCompany } = useCompany();
  const [formData, setFormData] = useState<Partial<Company>>(storedCompany);
  const { setErrorStatus, setReplacePath } = useUI();
  const navigate = useNavigate();

  useEffect(() => {
    if (! auth) {
      navigate(RoutePath[AppRoutes.LOGIN]);
      setReplacePath(RoutePath[AppRoutes.COMPANY_PROFILE]);
    }
    // Обнулить если была записана ошибка, например 401, 403...
    setErrorStatus(0);
    setFormData(storedCompany);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, storedCompany]);


  const handleChange = (e: ChangeEvent<HTMLInputElement>, scheme: string) => {
    const { value } = e.target;

    setFormData(prev => {
      const data = cloneObj(prev);
      setValueByScheme(data, scheme, value);

      const { valid, errors } = validateCompanyData({ id: storedCompany.id, ...data });
      if (! valid) setErrors(errors);

      return data;
    });
  };


  const handleSubmit = useCallback(async () => {
    if (loading) return;

    const updatedData: PartialCompany = {
      ...getChanges(storedCompany, formData),
      id         : storedCompany.id,
      lastChange : creatorFixDate(userId)
    };

    __devLog('CompanyProfilePage', 'updatedData: ', updatedData);
    if (isEmpty(updatedData)) return;

    const { valid, errors } = validateCompanyData(updatedData);
    valid ? serviceUpdateCompany(updatedData) : setErrors(errors);
  },
    [loading, userId, formData, storedCompany, setErrors, serviceUpdateCompany]
  );


  const handleCancel = useCallback(async () => {
    setFormData(storedCompany);
  }, [storedCompany]);


  if (! auth) return null;


  return (
    <CompanyProfilePageComponent
      isChanges = {Boolean(Object.keys(getChanges(storedCompany, formData)).length)}
      formData  = {formData}
      loading   = {loading}
      errors    = {errors}
      onCancel  = {handleCancel}
      onChange  = {handleChange}
      onSubmit  = {handleSubmit}
    />
  );
});


export default CompanyProfilePage;
