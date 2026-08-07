import { FC, memo, useMemo } from 'react';
import { getParents, NO_SHEET_ID } from 'entities/dashboard-view';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { Template } from 'entities/dashboard-templates';
import Box from '@mui/material/Box';
import { DashboardRender } from 'widgets/dashboard-render';
import { pxToRem } from 'shared/styles';



interface Props {
  template : Template
  onClick  : (id: string) => void
}

/** Контейнер с 1м шаблоном */
export const TemplateItemContainer: FC<Props> = memo(({ template, onClick }) => {
  const parents = useMemo(() => getParents(Object.values(template.viewItems)), [template]);


  return (
    <Box
      sx={{
        width        : 'max-content',
        border       : '1px solid #b0b0b0',
        borderRadius : pxToRem(4),
        mb           : 2,
        p            : 2
      }}
    >
      <DashboardRender
        isTemplate
        parents  = {parents}
        parentId = {template.id}
        onSelect = {onClick}
      />
    </Box>
  )
});
