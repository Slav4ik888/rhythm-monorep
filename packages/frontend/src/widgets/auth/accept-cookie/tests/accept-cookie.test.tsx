// packages/frontend/src/widgets/auth/accept-cookie/tests/accept-cookie.test.tsx
// Smoke-тест виджета согласия на использование cookie.

import { screen } from '@testing-library/react';
import AcceptCookieLogics from 'widgets/auth/accept-cookie/ui';
import { useUIStore } from 'entities/ui';
import { renderPage } from 'shared/lib/tests/render-page';

describe('AcceptCookie (smoke)', () => {
  beforeEach(() => {
    useUIStore.setState({ acceptedCookie: false });
  });

  it('рендерится без ошибок и показывает текст согласия', () => {
    renderPage(<AcceptCookieLogics />);

    expect(screen.getByText(/Этот сайт использует cookie/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Согласен' })).toBeInTheDocument();
  });

  it('не рендерится, если cookie уже приняты', () => {
    useUIStore.setState({ acceptedCookie: true });

    const { container } = renderPage(<AcceptCookieLogics />);

    expect(container).toBeEmptyDOMElement();
  });
});
