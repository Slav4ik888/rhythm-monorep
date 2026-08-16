// packages/frontend/src/widgets/page-error/tests/page-error.test.tsx
// Smoke-тест страницы ошибки.

import { screen } from '@testing-library/react';
import { PageError } from 'widgets/page-error';
import { renderPage } from 'shared/lib/tests/render-page';

describe('PageError (smoke)', () => {
  it('рендерит сообщение об ошибке и кнопку обновления', () => {
    renderPage(<PageError />);

    expect(screen.getByText('Произошла непредвиденная ошибка')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Обновить страницу' })).toBeInTheDocument();
  });
});
