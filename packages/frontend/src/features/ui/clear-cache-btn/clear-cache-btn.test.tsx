// packages/frontend/src/features/ui/clear-cache-btn/clear-cache-btn.test.tsx
// Smoke-тест кнопки очистки кэша.

import { screen } from '@testing-library/react';
import { renderPage } from 'shared/lib/tests/render-page';
import { ClearCacheBtn } from '..';

describe('ClearCacheBtn (smoke)', () => {
  it('рендерится без ошибок и показывает текст', () => {
    renderPage(<ClearCacheBtn />);

    expect(screen.getByText('Очистить кэш и обновить')).toBeInTheDocument();
  });
});
