import { FC } from 'react';
import { MDBox } from 'shared/ui/mui-design-components';
import { AddUserRoot, ProfilesMenuRoot, OpenUIConfiguratorBtn } from 'features/ui';
import { CustomTheme } from 'app/providers/theme';
import { sxNavbarRow } from '../../styles';
import { DashboardSetEditBtn } from 'features/dashboard-view';
import { useAccess } from 'entities/company';
import { usePages } from 'shared/lib/hooks';
import { useUI } from 'entities/ui';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components';
import { reducerUserFeatures } from 'features/user';



const reducers: ReducersList = {
  userFeatures: reducerUserFeatures
};


interface Props {
  light?: boolean
}

/** Кнопки Navbar меню после авторизации */
export const MenuBtns: FC<Props> = ({ light }) => {
  const { isMobile } = useUI();
  const { isDashboardPage } = usePages();
  const { isDashboardAccessEdit } = useAccess();


  return (
    <DynamicModuleLoader reducers={reducers}>
      <MDBox sx={(theme: CustomTheme) => sxNavbarRow(theme)}>
        <MDBox display='flex' alignItems='center' color={light ? 'white' : 'inherit'}>
          {
            isDashboardPage
            && isDashboardAccessEdit
            && ! isMobile
            && (
              <>
                <DashboardSetEditBtn />
                <AddUserRoot />
              </>
            )
          }
          {/* <OpenNotificationMenuBtn /> */}
          <OpenUIConfiguratorBtn />
          <ProfilesMenuRoot />
        </MDBox>
      </MDBox>
    </DynamicModuleLoader>
  );
};
