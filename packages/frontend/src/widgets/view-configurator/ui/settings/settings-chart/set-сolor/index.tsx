import { FC, memo, useCallback } from 'react';
import { useDashboardViewActions, ViewItem } from 'entities/dashboard-view';
import { ConfiguratorTextTitle, RowWrapper } from 'shared/ui/configurators-components';
import { ColorPicker } from 'shared/lib/colors-picker';
import { getValueByScheme, setValueByScheme, updateObject } from 'shared/helpers/objects';



interface Props {
  scheme       : string
  title        : string
  toolTitle    : string
  selectedItem : ViewItem | undefined
}

/** Установка цвета элементам графика (by scheme) */
export const ChartSetColorByScheme: FC<Props> = memo(({ selectedItem, scheme, title, toolTitle }) => {
  const { changeOneSettingsField } = useDashboardViewActions();

  const handleChange = useCallback((value: string | number) => {
    const result = {};
    const chartOptionsScheme = scheme.split('.').slice(2).join('.'); // Убираем вступление
    setValueByScheme(result, chartOptionsScheme, value);

    changeOneSettingsField({
      field: 'chartOptions',
      value: updateObject(
        selectedItem?.settings?.chartOptions || {},
        result
      )
    });
  }, [scheme, selectedItem, changeOneSettingsField]);


  return (
    <RowWrapper>
      <ConfiguratorTextTitle bold title={title} toolTitle={toolTitle} />
      <ColorPicker
        defaultColor = {getValueByScheme(selectedItem, scheme)}
        onChange     = {handleChange}
      />
    </RowWrapper>
  )
});
