import { FC, memo, useCallback, useEffect, useState, ChangeEvent } from 'react';
import { useUser, creatorUser, PartialUser, validateUserData } from 'entities/user';
import { useNavigate } from 'react-router-dom';
import { AppRoutes, RoutePath } from 'app/providers/routes';
import { UserProfilePageComponent } from './component';
import { useUI } from 'entities/ui';
import { cloneObj, getChanges, isEmpty, setValueByScheme } from 'shared/helpers/objects';
import { reducerUserFeatures, useFeaturesUser } from 'features/user';
import { creatorFixDate } from 'entities/base';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components';



const reducers: ReducersList = {
  userFeatures: reducerUserFeatures
};


const UserProfilePage: FC = memo(() => {
  const { loading, auth, errors, user: storedUser, setErrors } = useUser();
  const { serviceUpdateUser } = useFeaturesUser();
  const [formData, setFormData] = useState(creatorUser(storedUser));
  const { setErrorStatus, setReplacePath } = useUI();
  const navigate = useNavigate();


  useEffect(() => {
    if (! auth) {
      navigate(RoutePath[AppRoutes.LOGIN]);
      setReplacePath(RoutePath[AppRoutes.USER_PROFILE]);
    }

    // Обнулить если была записана ошибка, например 401, 403...
    setErrorStatus(0);
    setFormData(storedUser);
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [auth, storedUser]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>, scheme: string) => {
    const { value } = e.target;

    setFormData(prev => {
      const data = cloneObj(prev);
      setValueByScheme(data, scheme, value);

      const { valid, errors } = validateUserData({ ...data, id: storedUser.id });
      if (! valid) setErrors(errors);

      return data;
    });
  };

  const handleSubmit = useCallback(async () => {
    if (loading) return;

    const updatedData: PartialUser = {
      ...getChanges(storedUser, formData),
      id         : storedUser.id,
      companyId  : storedUser.companyId,
      lastChange : creatorFixDate(storedUser.id)
    };

    __devLog('UserProfilePage', 'updatedData: ', updatedData);
    if (isEmpty(updatedData)) return;

    const { valid, errors } = validateUserData(updatedData);
    valid ? serviceUpdateUser(updatedData) : setErrors(errors);
    serviceUpdateUser(updatedData as PartialUser);
  },
    [storedUser, formData, loading, serviceUpdateUser, setErrors]
  );


  const handleCancel = useCallback(async () => {
    setFormData(storedUser);
  },
    [storedUser]
  );


  if (! auth) return null;

  return (
    <DynamicModuleLoader reducers={reducers}>
      <UserProfilePageComponent
        isChanges = {Boolean(Object.keys(getChanges(storedUser, formData)).length)}
        formData  = {formData}
        loading   = {loading}
        errors    = {errors}
        onCancel  = {handleCancel}
        onChange  = {handleChange}
        onSubmit  = {handleSubmit}
      />
    </DynamicModuleLoader>
  );
});


export default UserProfilePage;
