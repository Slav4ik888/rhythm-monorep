// packages/frontend/src/widgets/hints/tests/hints.test.tsx
// Smoke-тест контейнера обучающих подсказок.

import { screen } from '@testing-library/react';
import { HintsContainer } from 'widgets/hints';
import { useHintsStore } from 'entities/hints';
import { useUserStore } from 'entities/user';
import { renderPage } from 'shared/lib/tests/render-page';

describe('HintsContainer (smoke)', () => {
  beforeEach(() => {
    useUserStore.setState({
      auth: true,
      user: { id: 'u1', companyId: 'c1', settings: {} } as never,
    });
    useHintsStore.setState({ currentHintId: 'control-date-end', hintsQueue: [], shownHints: [] });

    // Целевой элемент подсказки должен существовать в DOM ДО рендера:
    // HintContainer ищет его через document.getElementById в фазе рендера.
    const target = document.createElement('div');
    target.id = 'control-date-end';
    document.body.appendChild(target);
  });

  afterEach(() => {
    document.getElementById('control-date-end')?.remove();
  });

  it('рендерится без ошибок и показывает подсказку', () => {
    renderPage(<HintsContainer />);

    expect(screen.getByText('Конечная дата периода')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Понятно' })).toBeInTheDocument();
  });
});
