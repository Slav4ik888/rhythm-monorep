import { FC, memo } from 'react';
import { RowFlagByScheme, RowInputByScheme, RowSelectByScheme } from '../../base-features-components';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { arrayEndingDiffType, arrayEndingType, ViewItem } from 'entities/dashboard-view';
import { InvertedData, UnchangedBlack, SelectKodRow, ToolTitleRow } from '../base-components';



interface Props {
  selectedItem: ViewItem | undefined
}

/** Вкладка Settings for DigitIndicator */
export const ViewItemDigitIndicatorSettingsConfigurator: FC<Props> = memo(({ selectedItem }) => (
  <>
    <SubHeader title='Базовые настройки'>
      <SelectKodRow   selectedItem={selectedItem} />
      <InvertedData   type={selectedItem?.type} />
      <UnchangedBlack />
      <ToolTitleRow />
    </SubHeader>

    <SubHeader title='Особые настройки'>
      <RowInputByScheme
        scheme       = 'settings.valueNumber'
        type         = 'number'
        selectedItem = {selectedItem}
        title        = 'valueNumber'
        toolTitle    = 'Номер значения статистики, в обратном порядке (1 - последнее, 2 - предпоследнее)'
        onChange     = {() => {}}
      />
      <RowInputByScheme
        scheme       = 'settings.kfValue'
        type         = 'number'
        selectedItem = {selectedItem}
        title        = 'kfValue'
        toolTitle    = 'Поправое значение КФ, на которое будет умножено значение'
        onChange     = {() => {}}
      />
      <RowFlagByScheme
        scheme       = 'settings.plusMinus'
        title        = 'plusMinus'
        toolTitle    = 'Показывать знаки [+/-] при росте/падении'
      />
      <RowFlagByScheme
        scheme       = 'settings.growthColor'
        title        = 'growthColor'
        toolTitle    = 'Красить зелёным при росте / красным при падении'
      />
    </SubHeader>

    <SubHeader title='Разряды'>
      <RowFlagByScheme
        scheme       = 'settings.reduce'
        title        = 'reduce'
        toolTitle    = 'Убрать разряды: 12 500 700 => 12.5 млн'
      />
      <RowFlagByScheme
        scheme       = 'settings.noSpace'
        title        = 'noSpace'
        toolTitle    = 'Убрать пробелы между разрядами: 12 500 => 12500'
      />
      <RowInputByScheme
        scheme       = 'settings.fractionDigits'
        type         = 'number'
        title        = 'fractionDigits'
        toolTitle    = 'Количество знаков после запятой'
        selectedItem = {selectedItem}
        onChange     = {() => {}}
      />
      <RowFlagByScheme
        scheme       = 'settings.addZero'
        title        = 'addZero'
        toolTitle    = 'Добавлять ли нули после запятой, чтобы выровнить до нужного кол-ва знаков'
      />
    </SubHeader>

    <SubHeader title='Prefix'>
      <RowSelectByScheme
        scheme       = 'settings.endingType'
        title        = 'endingType'
        toolTitle    = ''
        array        = {arrayEndingType}
      />
      <RowSelectByScheme
        scheme       = 'settings.endingDiffType'
        title        = 'endingDiffType'
        toolTitle    = ''
        array        = {arrayEndingDiffType}
      />
    </SubHeader>
  </>
));
