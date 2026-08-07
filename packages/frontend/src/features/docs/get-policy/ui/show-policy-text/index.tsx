import { FC, memo } from 'react';
import Box from '@mui/material/Box';
import { PageLoader } from 'widgets/page-loader';
import { useDocs } from 'entities/docs';
import { MarkdownWithExternalLinks } from 'shared/lib/markdown';
import { useInitialEffect } from 'shared/lib/hooks';



export const ShowPolicyText: FC = memo(() => {
  const { loading, policy, serviceGetPolicy } = useDocs();

  useInitialEffect(() => {
    serviceGetPolicy();
  });

  return (
    <Box sx={{ minHeight: 100 }}>
      <PageLoader loading={loading} text='Загрузка политики конфеденциальности...' />
      <MarkdownWithExternalLinks content={policy} />
    </Box>
  );
});
