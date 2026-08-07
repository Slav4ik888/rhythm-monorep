import { FC, memo } from 'react';
import { ConfiguratorSubHeader as SubHeader } from 'shared/ui/configurators-components';
import { ViewItem, ViewItemStylesField } from 'entities/dashboard-view';
import { FlexPanelAlignment } from './flex-panel';
import { TextPanelAlignment } from './text-panel';



interface Props {
  selectedItem : ViewItem | undefined
  onChange     : (field: ViewItemStylesField, value: number | string, funcName: string) => void
}

/** Выравнивание внутреннего содержимого */
export const AlignmentBox: FC<Props> = memo(({ selectedItem, onChange }) => (
    <SubHeader title='Выравнивание'>
      {
        selectedItem?.type === 'text'
          ? <TextPanelAlignment selectedItem={selectedItem} onChange={onChange} />
          : <FlexPanelAlignment selectedItem={selectedItem} onChange={onChange} />
      }

      {/* display - flex, block, inline ... */}
      {/* flex-direction */}
      {/* flex-wrap */}
      {/* align-items */}
      {/* justify-content */}


    </SubHeader>
  ));
