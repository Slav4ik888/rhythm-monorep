import { memo } from 'react';
import { setSidebarColor, useUIConfiguratorController } from 'app/providers/theme';
import { SidebarColorName, sidebarThemes } from 'app/providers/theme/model/themes/light-sidebar';
import { MDBox } from 'shared/ui/mui-design-components';
import { UIConfiguratorItemWrapper } from '../../components/ui-configurator-item-wrapper';
import { pxToRem } from 'shared/styles';



const sidebarNames = Object.keys(sidebarThemes) as SidebarColorName[];
const COLOR_DIAMETER = 30; // px
const ACTIVE_INDENT  = 2;  // px, отступ от круглешка активного цвета
const ACTIVE_WIDTH   = 2;  // px, ширина обводки вокруг активного цвета

const useStyles = () => ({
  item: {
    position       : 'relative',
    display        : 'flex',
    alignItems     : 'center',
    justifyContent : 'center',
    width          : pxToRem(COLOR_DIAMETER),
    height         : pxToRem(COLOR_DIAMETER),
    borderRadius   : '50%',
    mx             : 1,
  },
  active: {
    position       : 'absolute',
    top            : pxToRem(-1 * (ACTIVE_INDENT + ACTIVE_WIDTH)),
    left           : pxToRem(-1 * (ACTIVE_INDENT + ACTIVE_WIDTH)),
    width          : pxToRem(COLOR_DIAMETER + ACTIVE_INDENT + ACTIVE_WIDTH),
    height         : pxToRem(COLOR_DIAMETER + ACTIVE_INDENT + ACTIVE_WIDTH),
    borderRadius   : '50%',
    border         : `${pxToRem(ACTIVE_WIDTH)} solid #000000`,
  },
});


export const SwitcherSidebarColor = memo(() => {
  const sx = useStyles();
  const [configuratorState, dispatch] = useUIConfiguratorController();
  const { sidebarColor } = configuratorState;

  const handleSelect = (color: SidebarColorName) => setSidebarColor(dispatch, color);


  return (
    <UIConfiguratorItemWrapper>
      {
        sidebarNames.map((name) => {
          const theme = sidebarThemes[name].sidebar;

          return (
            <MDBox
              key={name}
              sx={
                {
                  ...sx.item,
                  background : theme.main,
                  cursor     : 'pointer',
                  border     : name === sidebarColor ? `${pxToRem(ACTIVE_INDENT)} solid #ffffff` : 'none',
                }
              }
              onClick = {() => handleSelect(name)}
            >
              {
                name === sidebarColor && <MDBox sx={sx.active} />
              }
            </MDBox>
          )
        })
      }
    </UIConfiguratorItemWrapper>
  )
});
