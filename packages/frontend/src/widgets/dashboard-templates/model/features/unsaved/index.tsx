import { FC, memo, useCallback } from 'react';
import { useDashboardTemplates } from 'entities/dashboard-templates';
import { UnsavedChangesComponent } from 'shared/ui/configurators-components';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { pxToRem } from 'shared/styles';



export const UnsavedChanges: FC = memo(() => {
  const {
    loading, selectedTemplate, isUnsaved, cancelUpdateTemplate, serviceUpdateTemplate
  } = useDashboardTemplates();


  const handleCancel = useCallback(() => {
    cancelUpdateTemplate()
  }, [cancelUpdateTemplate]);


  const handleSubmit = useCallback(() => {
    if (! selectedTemplate) return;

    serviceUpdateTemplate({
      bunchUpdatedMs : Date.now(),
      template       : selectedTemplate,
      bunchAction    : 'update',
      fullSet        : true
    });
  },
    [selectedTemplate, serviceUpdateTemplate]
  );



  if (! isUnsaved) return null;


  return (
    <UnsavedChangesComponent
      loading  = {loading}
      onClick  = {handleSubmit}
      onCancel = {handleCancel}
      sx={{
        root: {
          top   : pxToRem(7),
          right : pxToRem(5)
        }
      }}
    />
  )
});
