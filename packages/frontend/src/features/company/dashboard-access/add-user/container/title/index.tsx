// packages/frontend/src/features/company/dashboard-access/add-user/container/title/index.tsx

import { FC } from 'react';
import Typography, { TypographyOwnProps } from '@mui/material/Typography';

type Props = {
  label: string;
  variant: TypographyOwnProps['variant'];
};

export const Title: FC<Props> = ({ label, variant }) => (
  <Typography variant={variant} align='center' color='text.dark' sx={{ mt: 2 }}>
    {label}
  </Typography>
);
