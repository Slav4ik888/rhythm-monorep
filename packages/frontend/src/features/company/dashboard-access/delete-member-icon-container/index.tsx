import { FC, memo, useCallback } from 'react';
import { getTypography } from 'shared/styles';
import { CustomTheme } from 'app/providers/theme';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { CompanyDashboardMember, useCompany } from 'entities/company';
import { Tooltip } from 'shared/ui/tooltip';
import { getArrWithoutItem } from 'shared/helpers/arrays';



interface Props {
  member: CompanyDashboardMember
}


export const DeleteMemberIconContainer: FC<Props> = memo(({ member }) => {
  const { paramsCompany, serviceUpdateCompany } = useCompany();

  const handleDelete = useCallback(() => {
    serviceUpdateCompany({
      id: paramsCompany.id,
      dashboardMembers: getArrWithoutItem(paramsCompany?.dashboardMembers, member.e, 'e')
    });
  }, [member, paramsCompany, serviceUpdateCompany]);


  return (
    <Tooltip title='Закрыть доступ этому пользователю'>
      <IconButton color='inherit' onClick={handleDelete}>
        <CloseIcon
          sx={(theme) => ({
            fontSize    : `${getTypography(theme as CustomTheme).size.xs} !important`,
            color       : 'text.light',
            stroke      : 'currentColor',
            strokeWidth : '1px',
            cursor      : 'pointer',
            transform   : 'translateY(1px)', // Сдвинуть вниз
          })}
        />
      </IconButton>
    </Tooltip>
  )
});
