// packages/frontend/src/widgets/version/tests/version.test.tsx
// Smoke-тест виджета версии сборки.

import { screen } from '@testing-library/react';
import { VersionWidjet } from 'widgets/version';
import cfg from 'app/config';
import { renderPage } from 'shared/lib/tests/render-page';

describe('VersionWidjet (smoke)', () => {
  it('рендерит номер версии из конфига', () => {
    renderPage(<VersionWidjet />);

    expect(screen.getByText(cfg.VERSION)).toBeInTheDocument();
  });
});
