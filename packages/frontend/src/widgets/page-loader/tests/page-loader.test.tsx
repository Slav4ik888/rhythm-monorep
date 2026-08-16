// packages/frontend/src/widgets/page-loader/tests/page-loader.test.tsx
// Smoke-тест виджета глобального лоадера страницы.

import { screen } from '@testing-library/react';
import { PageLoader } from 'widgets/page-loader';
import { useUIStore } from 'entities/ui';
import { renderPage } from 'shared/lib/tests/render-page';

describe('PageLoader (smoke)', () => {
  beforeEach(() => {
    useUIStore.setState({ pageLoading: {} });
  });

  it('рендерит лоадер с текстом из пропсов loading/text', () => {
    renderPage(<PageLoader loading text='Загрузка данных...' />);

    expect(screen.getByText('Загрузка данных...')).toBeInTheDocument();
  });

  it('рендерит строки из глобального pageLoading', () => {
    useUIStore.setState({
      pageLoading: { 'get-auth': { text: 'Авторизация...', name: 'test' } },
    });

    renderPage(<PageLoader />);

    expect(screen.getByText('Авторизация...')).toBeInTheDocument();
  });

  it('не рендерит ничего без loading и пустого pageLoading', () => {
    const { container } = renderPage(<PageLoader />);

    expect(container).toBeEmptyDOMElement();
  });
});
