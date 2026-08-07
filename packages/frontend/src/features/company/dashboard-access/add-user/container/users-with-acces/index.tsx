import { FC, memo } from 'react';
import { f, pxToRem } from 'shared/styles';
import Box from '@mui/material/Box';
import { Title } from '../title';
import { CustomTheme } from 'app/providers/theme';
import Typography from '@mui/material/Typography';
import { AccessLevel, ACCESS_TYPE, useCompany } from 'entities/company';
import { Tooltip } from 'shared/ui/tooltip';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { DeleteMemberIconContainer } from '../../../delete-member-icon-container';
// import { Divider } from 'shared/ui/mui-components';



const overStyle = {
  whiteSpace   : 'nowrap',       /* Запрет переноса строк */
  overflow     : 'hidden',       /* Скрытие выходящего за границы контента */
  textOverflow : 'ellipsis',     /* Добавление "..." в конце */
};


interface Props {
  onEmailClick: (email: string) => void
}

/** Список пользователей с доступом к дашборду */
export const UsersWithAccessContainer: FC<Props> = memo(({ onEmailClick }) => {
  const { usersAccessDashboard } = useCompany();

  return (
    <Box sx={{ ...f('c'), gap: 2, width: '100%', minHeight: pxToRem(70) }}>
      <Title label='Пользователи, имеющие доступ' variant='body1' />
      <Divider />
      <Box
        sx={(theme) => ({
          ...f('c'),
          gap          : 1,
          width        : '100%',
          minHeight    : pxToRem(50),
          border       : `1px solid ${(theme as CustomTheme).palette.text.light}`,
          borderRadius : pxToRem(4),
        })}
      >
        {
          usersAccessDashboard.map(member => (
            <Box
              key = {member.e}
              sx  = {{ ...f('-c-sb'), width: '100%', gap: 1, p: 1.5 }}
            >
              <Chip
                label   = {member.e}
                sx      = {{ cursor: 'pointer', maxWidth: pxToRem(180), ...overStyle }}
                onClick = {() => onEmailClick(member.e)}
              />
              <Box sx={{ ...f('-c'), gap: 1 }}>
                <Divider
                  orientation = 'vertical'
                  color       = 'text.light'
                  sx          = {{ height: pxToRem(16), m: 0.5 }}
                />

                <Tooltip title={ACCESS_TYPE[member.a?.f as AccessLevel]?.label}>
                  <Typography
                    variant  = 'caption'
                    color    = 'text.main'
                    children = {ACCESS_TYPE[member.a?.f as AccessLevel]?.label}
                    sx       = {{ cursor: 'default', width: pxToRem(80), ...overStyle }}
                  />
                </Tooltip>

                <DeleteMemberIconContainer member={member} />
              </Box>
            </Box>
          ))
        }
      </Box>
    </Box>
  )
});
