import { ViewItem } from 'entities/dashboard-view';
import { FC, memo, MouseEvent } from 'react';
import { ConfiguratorTitle } from 'shared/ui/configurators-components';
import { RowInputByScheme } from '../../../../base-features-components';



interface Props {
  selectedItem: ViewItem | undefined
}

/** Настройки Min | max - на оси Y */
export const ViewItemChartScaleYMinMax: FC<Props> = memo(({ selectedItem }) => (
  <>
    <ConfiguratorTitle title='Min | max' type='title2' />
    <RowInputByScheme
      type         = 'number'
      selectedItem = {selectedItem}
      scheme       = 'settings.chartOptions.scales.y.min'
      title        = 'min'
      toolTitle    = 'Изменить min'
      width        = '7rem'
      clear        = {null}
      onChange     = {(e: MouseEvent, v: string | number) => {}}
    />
    <RowInputByScheme
      type         = 'number'
      selectedItem = {selectedItem}
      scheme       = 'settings.chartOptions.scales.y.max'
      title        = 'max'
      toolTitle    = 'Изменить max'
      width        = '7rem'
      clear        = {null}
      onChange     = {(e: MouseEvent, v: string | number) => {}}
    />
    <RowInputByScheme
      type         = 'number'
      selectedItem = {selectedItem}
      scheme       = 'settings.chartOptions.scales.y.suggestedMin'
      title        = 'suggestedMin'
      toolTitle    = 'Изменить suggestedMin'
      width        = '7rem'
      clear        = {null}
      onChange     = {(e: MouseEvent, v: string | number) => {}}
    />
    <RowInputByScheme
      type         = 'number'
      selectedItem = {selectedItem}
      scheme       = 'settings.chartOptions.scales.y.suggestedMax'
      title        = 'suggestedMax'
      toolTitle    = 'Изменить suggestedMax'
      width        = '7rem'
      clear        = {null}
      onChange     = {(e: MouseEvent, v: string | number) => {}}
    />
  </>
));
