import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import { CustomTheme, useTheme } from 'app/providers/theme';
import { useDashboardViewState } from 'entities/dashboard-view';
import { FC, memo, useMemo } from 'react';
import { getIconById } from 'shared/lib/icons';
import { isStr } from 'shared/lib/validators';
import { f, pxToRem } from 'shared/styles';



const useStyles = (theme: CustomTheme) => ({
  root: {
    ...f('-c-c'),
    minWidth     : pxToRem(40),
    minHeight    : pxToRem(40),
    border       : `1px solid ${theme.palette.text.light}`,
    borderRadius : '50%',
    cursor       : 'pointer',
  },
  icon: {
    '&.MuiSvgIcon-root': {
      color: theme.palette.text.main,
    }
  }
});


interface Props {
  onClick: () => void
}

export const SelectedIcon: FC<Props> = memo(({ onClick }) => {
  const sx = useStyles(useTheme());
  const { selectedItem } = useDashboardViewState();

  const IconComponent = useMemo(() => getIconById(selectedItem.settings?.iconId),
    [selectedItem]
  );

  return (
    <Box
      sx      = {sx.root}
      onClick = {onClick}
    >
      {
        isStr(IconComponent)
          ? <Icon sx={sx.icon}>{IconComponent as string}</Icon>
          : <IconComponent sx={sx.icon} />
      }
    </Box>
  )
});
