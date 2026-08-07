// packages/frontend/src/app/config/config.test.ts

import { formatDate } from 'shared/helpers/dates';
import cfg from '.';

describe('config.js', () => {
  it('ASSEMBLY_DATE — сегодняшняя дата', () => {
    const currentDate = formatDate(new Date().getTime(), 'YYYY-MM-DD');
    expect(currentDate).toEqual(cfg.ASSEMBLY_DATE);
  });
});

// npm run test:unit config.test.ts
