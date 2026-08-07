import { FC, memo } from 'react';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { ViewItem } from 'entities/dashboard-view';
import { SelectKodRow, ToolTitleRow } from '../base-components';
import { GaugeColumnParameters } from './parameters';
import { DisplayParametersRow } from './display-parameters-row';
import { ColorParametersRow } from './color-parameters-row';
import { SelectTypeRow } from './select-type-row';
import { SelectDirectionRow } from './select-direction-row';
// import { DisplayResultRow } from './display-result-row';



interface Props {
  selectedItem: ViewItem | undefined
}

/** Вкладка Settings for GaugeColumn */
export const ViewItemGaugeColumnSettingsConfigurator: FC<Props> = memo(({ selectedItem }) => (
  <>
    <SubHeader title='Базовые настройки'>
      <SelectKodRow         selectedItem={selectedItem} />
      <SelectDirectionRow />
      <SelectTypeRow        selectedItem={selectedItem} />
      <ToolTitleRow />
    </SubHeader>

    <SubHeader title='Настройки параметров'>
      <GaugeColumnParameters selectedItem = {selectedItem} />
    </SubHeader>

    <SubHeader title='Отображение меток'>
      <DisplayParametersRow />
      <ColorParametersRow   selectedItem={selectedItem} />
      {/* <DisplayResultRow     selectedItem={selectedItem} /> */}
    </SubHeader>
  </>
));
