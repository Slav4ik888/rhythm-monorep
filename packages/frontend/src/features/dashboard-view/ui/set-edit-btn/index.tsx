import { FC, memo } from 'react';
import { useUser } from 'entities/user';
import { DashboardSetEditBtnContainer } from './ui';

export const DashboardSetEditBtn: FC = memo(() => {
  const { isEditAccess } = useUser();

  // Заглушка на время разработки: режим редактирования включается индивидуально,
  // вручную через консоль Firebase (isEditAccess: true). На бэке не проверяется.
  if (!isEditAccess) return null;

  return <DashboardSetEditBtnContainer />;
});
