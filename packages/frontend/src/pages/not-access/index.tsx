import { LayoutEmptyPage } from 'shared/ui/pages';
import { useCompany } from 'entities/company';
import { useInitialEffect } from 'shared/lib/hooks';


export const NotAccessPage = () => {
  const { company, updateParamsCompany } = useCompany();

  // Если прошли по ссылке, а доступа нет,
  // то в paramsCompany передаётся данные по компании пользователя
  useInitialEffect(() => {
    updateParamsCompany(company);
  });

  return (
    <LayoutEmptyPage>
      Извините, у вас нет доступа к этой странице.
    </LayoutEmptyPage>
  )
};
