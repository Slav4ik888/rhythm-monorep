import { FC, memo, useEffect, SyntheticEvent, useMemo, useCallback } from 'react';
import { ViewItem, ViewItemType } from 'entities/dashboard-view';
import Tab from '@mui/material/Tab';
import { ViewItemStylesConfigurator } from '../styles';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { ViewItemConfiguratorSettings } from '../settings';
import { ViewItemControlConfigurator } from '../control';
import { CustomTheme } from 'app/providers/theme';



const sxTabPanel = {
  overflowY: 'auto',
  p: 0,
};

// Типы у которых есть вкладка settings
const settingTypes: ViewItemType[] = [
  'box', 'text', 'chart', 'icon', 'period', 'chip', 'growthIcon', 'digitIndicator', 'gaugeColumn', 'list'
];


interface Props {
  value        : string
  selectedItem : ViewItem
  onSetValue   : (value: string) => void
}

export const ViewItemConfiguratorTabs: FC<Props> = memo(({ value, selectedItem, onSetValue }) => {
  const isSettings = useMemo(() => settingTypes.includes(selectedItem?.type), [selectedItem]);

  useEffect(() => {
    if (value === '3' && ! isSettings) onSetValue('1');
  }, [value, isSettings, onSetValue]);

  const handleChange = useCallback((event: SyntheticEvent, newValue: string) => onSetValue(newValue),
    [onSetValue]);


  return (
    <TabContext value={value}>
      <TabList
        aria-label = 'lab API tabs example'
        onChange   = {handleChange}
        sx         = {{
          borderBottom: 1,
          borderColor: 'divider',
          mt: 2,
        }}
      >
        <Tab
          label = 'Control'
          value = '1'
          sx    = {(theme) => ({
            // '&.Mui-selected': { color: 'red' },
            '&:not(.Mui-selected)': {
              color: (theme as CustomTheme).palette.configurator.tabs.notSelected
            },
          })}
        />
        <Tab
          label = 'Styles'
          value = '2'
          sx    = {(theme) => ({
            // '&.Mui-selected': { color: 'red' },
            '&:not(.Mui-selected)': {
              color: (theme as CustomTheme).palette.configurator.tabs.notSelected
            },
          })}
        />
        <Tab
          label = {isSettings ? 'Settings' : null}
          value = '3'
          sx    = {(theme) => ({
            // '&.Mui-selected': { color: 'red' },
            '&:not(.Mui-selected)': {
              color: (theme as CustomTheme).palette.configurator.tabs.notSelected
            },
          })}
        />
      </TabList>

      <TabPanel value='1' keepMounted sx={sxTabPanel}>
        <ViewItemControlConfigurator />
      </TabPanel>
      <TabPanel value='2' keepMounted sx={sxTabPanel}>
        <ViewItemStylesConfigurator />
      </TabPanel>
      <TabPanel value='3' keepMounted sx={sxTabPanel}>
        <ViewItemConfiguratorSettings selectedItem={selectedItem} />
      </TabPanel>
    </TabContext>
  )
});
