import { FC, memo, useCallback, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { CustomTheme } from 'app/providers/theme';
import { TooltipHTML } from 'shared/ui/tooltip';
import { f } from 'shared/styles';
import { LS } from 'shared/lib/local-storage';
import { useCompany } from 'entities/company';
import { CodeStringify } from 'shared/ui/code-stringify';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { useUI } from 'entities/ui';
import { isEmpty } from 'shared/helpers/objects';
import { getIconStyle } from 'shared/ui/configurators-components';



export const ClearLsBunchesUpdated: FC = memo(() => {
  const { paramsCompanyId } = useCompany();
  const { setSuccessMessage } = useUI();
  const [bunchesUpdated, setBunchesUpdated] = useState(LS.getViewBunchesUpdated(paramsCompanyId));

  useEffect(() => {
    const handleStorageChange = () => {
      setBunchesUpdated(LS.getViewBunchesUpdated(paramsCompanyId));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  },
    [paramsCompanyId]
  );

  const handleClick = useCallback(() => {
    LS.setViewBunchesUpdated(paramsCompanyId, {});

    // Вручную эмулируем событие storage
    window.dispatchEvent(new Event('storage'));
    setSuccessMessage('BunchesUpdated в LS очищено.');
  },
    [paramsCompanyId, setSuccessMessage]
  );


  return (
    <IconButton
      sx      = {{ cursor: 'pointer' }}
      color   = 'inherit'
      onClick = {handleClick}
    >
      <TooltipHTML
        sxSpan = {f('-c-c')}
        title  = {
          isEmpty(bunchesUpdated)
            ? <p>BunchesUpdated в LS - пусто</p>
            : <>
                <p>Очистить bunchesUpdated в LS:</p>
                <CodeStringify obj={bunchesUpdated} />
              </>
        }
      >
        <RecyclingIcon
          sx={(theme) => getIconStyle(
            theme as CustomTheme,
            isEmpty(bunchesUpdated) ? 'empty' : 'default'
          )}
        />
      </TooltipHTML>
    </IconButton>
  )
});
