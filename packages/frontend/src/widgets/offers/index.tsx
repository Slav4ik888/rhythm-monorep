// packages/frontend/src/widgets/offers/index.tsx

import { memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { f } from 'shared/styles';

export const NewCompanyMessage = memo(() => {
  const subject = encodeURIComponent('Запрос условий по Ритму');
  const body = encodeURIComponent('Здравствуйте, интересуют условия сотрудничества.');
  const mailtoLink = `mailto:info@thm.su?subject=${subject}&body=${body}`;

  return (
    <Box sx={{ ...f('c-c-c-w'), height: '60vh' }}>
      <Typography variant='h5' sx={{ my: 2 }}>
        Разработка дашборда производится индивидуально.
      </Typography>
      <Typography variant='h5'>
        Для получения информации{' '}
        <a href={mailtoLink} rel='noopener noreferrer'>
          отправьте запрос.
        </a>
      </Typography>
    </Box>
  );
});
