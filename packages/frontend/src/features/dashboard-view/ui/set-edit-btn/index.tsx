import { FC, memo } from 'react';
import { useUser } from 'entities/user';
import { DashboardSetEditBtnContainer } from './ui';



export const DashboardSetEditBtn: FC = memo(() => {
  const { isEditAccess } = useUser();


  // Временный запрет для всех на доступ к Конструктору
  if (! isEditAccess) return null;

  return (
    <DashboardSetEditBtnContainer />
  )
});
