import { FC, memo, useCallback, MouseEvent, useMemo } from 'react';
import Box from '@mui/material/Box';
import { useDashboardViewActions, ViewItem, ViewItemStyles, ViewItemStylesField } from 'entities/dashboard-view';
import { f } from 'shared/styles';
import { ConfiguratorTextTitle } from 'shared/ui/configurators-components';
import { InputByScheme } from '../../../base-features-components';
import { setFieldEmpty } from 'shared/helpers/objects';



const sxRow = {
  ...f('-fs-sb'),
  maxWidth: 'calc(100% - 1rem)'
};


interface Props {
  active?      : boolean
  selectedItem : ViewItem | undefined
}

/** border-radius */
export const BorderRadiusRow: FC<Props> = memo(({ active, selectedItem }) => {
  const { setSelectedStyles } = useDashboardViewActions();

  const {
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius
  } = useMemo(() => {
    const resultFields = {
      borderRadius            : 'borderRadius' as keyof ViewItemStyles,
      borderTopLeftRadius     : 'borderTopLeftRadius' as keyof ViewItemStyles,
      borderTopRightRadius    : 'borderTopRightRadius' as keyof ViewItemStyles,
      borderBottomLeftRadius  : 'borderBottomLeftRadius' as keyof ViewItemStyles,
      borderBottomRightRadius : 'borderBottomRightRadius' as keyof ViewItemStyles,
    };

    if (active) {
      resultFields.borderRadius            = 'activeBorderRadius';
      resultFields.borderTopLeftRadius     = 'activeBorderTopLeftRadius';
      resultFields.borderTopRightRadius    = 'activeBorderTopRightRadius';
      resultFields.borderBottomLeftRadius  = 'activeBorderBottomLeftRadius';
      resultFields.borderBottomRightRadius = 'activeBorderBottomRightRadius';
    }

    return resultFields
  },
    [active]
  );


  const handleChange = useCallback((field: ViewItemStylesField, value: number | string) => {
    if (! selectedItem) return;

    const newStyles: ViewItemStyles = {
      ...selectedItem?.styles,
      [field]: value,
    };

    if (field === 'borderRadius' || field === 'activeBorderRadius') {
      setFieldEmpty(newStyles, borderTopLeftRadius);
      setFieldEmpty(newStyles, borderTopRightRadius);
      setFieldEmpty(newStyles, borderBottomLeftRadius);
      setFieldEmpty(newStyles, borderBottomRightRadius);
    }

    setSelectedStyles(newStyles);
  },
    [
      selectedItem, borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius,
      setSelectedStyles
    ]
  );

  const handleEmpty = (e: MouseEvent, v: string | number) => {};


  return (
    <Box
      sx={{
        ...f('c'),
        mb : 1,
        py : 0.5,
      }}
    >
      <Box sx={sxRow}>
        {/* border-radius |Сверху-слева | Весь-верх | Сверху-справа | Всё-справа */}
        <Box sx={{ ...f('c-c-fs') }}>
          <ConfiguratorTextTitle bold title='border-radius' toolTitle='Border-radius' />
        </Box>
        <InputByScheme
          type         = 'number'
          selectedItem = {selectedItem}
          scheme       = {`styles.${borderTopLeftRadius}`}
          width        = '4rem'
          helperText   = 'Сверху-слева'
          onChange     = {handleEmpty}
          onBlur       = {(e: MouseEvent, v: string | number) => handleChange(borderTopLeftRadius, v)}
          onSubmit     = {(e: MouseEvent, v: string | number) => handleChange(borderTopLeftRadius, v)}
        />

        <InputByScheme
          type         = 'number'
          selectedItem = {selectedItem}
          scheme       = {`styles.${borderTopRightRadius}`}
          width        = '4rem'
          helperText   = 'Сверху-справа'
          onChange     = {handleEmpty}
          onBlur       = {(e: MouseEvent, v: string | number) => handleChange(borderTopRightRadius, v)}
          onSubmit     = {(e: MouseEvent, v: string | number) => handleChange(borderTopRightRadius, v)}
        />

      </Box>

      <Box sx={sxRow}>
      {/* Общее | Снизу-слева  | Весь-низ  | Снизу-справа  | Всё-слева */}
        <InputByScheme
          type         = 'number'
          selectedItem = {selectedItem}
          scheme       = {`styles.${borderRadius}`}
          width        = '4rem'
          helperText   = 'Общее'
          onChange     = {handleEmpty}
          onBlur       = {(e: MouseEvent, v: string | number) => handleChange(borderRadius, v)}
          onSubmit     = {(e: MouseEvent, v: string | number) => handleChange(borderRadius, v)}
        />
        <InputByScheme
          type         = 'number'
          selectedItem = {selectedItem}
          scheme       = {`styles.${borderBottomLeftRadius}`}
          width        = '4rem'
          helperText   = 'Снизу-слева'
          onChange     = {handleEmpty}
          onBlur       = {(e: MouseEvent, v: string | number) => handleChange(borderBottomLeftRadius, v)}
          onSubmit     = {(e: MouseEvent, v: string | number) => handleChange(borderBottomLeftRadius, v)}
        />
        <InputByScheme
          type         = 'number'
          selectedItem = {selectedItem}
          scheme       = {`styles.${borderBottomRightRadius}`}
          width        = '4rem'
          helperText   = 'Снизу-справа'
          onChange     = {handleEmpty}
          onBlur       = {(e: MouseEvent, v: string | number) => handleChange(borderBottomRightRadius, v)}
          onSubmit     = {(e: MouseEvent, v: string | number) => handleChange(borderBottomRightRadius, v)}
        />
      </Box>
    </Box>
  )
});
