// packages/frontend/src/widgets/message-bar/tests/message-bar.test.tsx
// Smoke-тест виджета глобальных сообщений (снекбар).

import { screen } from '@testing-library/react';
import { MessageBar } from 'widgets/message-bar';
import { useUIStore } from 'entities/ui';
import { renderPage } from 'shared/lib/tests/render-page';

describe('MessageBar (smoke)', () => {
  beforeEach(() => {
    useUIStore.setState({ message: {} as never });
  });

  it('рендерится без ошибок и показывает текст сообщения', () => {
    useUIStore.getState().setInfoMessage('Тестовое сообщение');

    renderPage(<MessageBar />);

    expect(screen.getByText('Тестовое сообщение')).toBeInTheDocument();
  });

  it('не рендерит ничего, если сообщения нет', () => {
    const { container } = renderPage(<MessageBar />);

    expect(container).toBeEmptyDOMElement();
  });
});
