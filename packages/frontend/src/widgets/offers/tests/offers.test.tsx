// packages/frontend/src/widgets/offers/tests/offers.test.tsx
// Smoke-тест сообщения для новых компаний.

import { screen } from '@testing-library/react';
import { NewCompanyMessage } from 'widgets/offers';
import { renderPage } from 'shared/lib/tests/render-page';

describe('NewCompanyMessage (smoke)', () => {
  it('рендерит текст и mailto-ссылку для запроса', () => {
    renderPage(<NewCompanyMessage />);

    expect(screen.getByText('Разработка дашборда производится индивидуально.')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'отправьте запрос.' });
    expect(link).toHaveAttribute('href', expect.stringContaining('mailto:info@thm.su'));
  });
});
