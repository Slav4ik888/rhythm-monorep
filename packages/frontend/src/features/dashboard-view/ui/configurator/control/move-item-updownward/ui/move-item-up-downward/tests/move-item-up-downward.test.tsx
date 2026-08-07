import { render, screen, fireEvent } from '@testing-library/react';
import { MoveItemUpdownward } from '..';
import { TowardType } from 'shared/ui/configurators-components';
import { DashboardViewEntities, useDashboardViewActions, ViewItem } from 'entities/dashboard-view';
import { setupRender } from 'shared/lib/tests';
import { StateSchema, StoreProvider } from 'app/providers/store';
import { UIConfiguratorProvider } from 'app/providers/theme';
import { cloneObj } from 'shared/helpers/objects';



// Мокаем хук useDashboardViewActions
// jest.mock('entities/dashboard-view');

const mockViewItem = {
  id: 'item-1',
  parentId: 'parent-1',
  order: 2,
} as ViewItem;

const mockChildrenViewItems = [
  { id: 'item-1', parentId: 'parent-1', order: 1000 },
  { id: 'item-2', parentId: 'parent-1', order: 2000 },
  { id: 'item-3', parentId: 'parent-1', order: 3000 },
];

const mockedStoreBase: DeepPartial<StateSchema> = {
  user: {},
  dashboardView: {
    selectedId: 'parent-1',
    entities: [
      { id: 'item-1', parentId: 'parent-1', order: 1000 },
      { id: 'item-2', parentId: 'parent-1', order: 2000 },
      { id: 'item-3', parentId: 'parent-1', order: 3000 },
    ] as unknown as DashboardViewEntities,
    loading : false,
    errors  : {}
  }
};

describe('MoveItemUpdownward', () => {
  // beforeEach(() => {
  //   (useDashboardViewActions as jest.Mock).mockReturnValue({
  //     childrenViewItems: mockChildrenViewItems,
  //     updateViewItems: jest.fn(),
  //   });
  // });

  it('рендерит кнопки "вверх" и "вниз"', () => {
    // render(<MoveItemUpdownward viewItem={mockViewItem} />);
    const mockedStore: DeepPartial<StateSchema> = cloneObj(mockedStoreBase);

    const { user, debug, getByTestId, getByRole, getByText } = setupRender(
      <StoreProvider initialState={mockedStore}>
        <UIConfiguratorProvider>
          <MoveItemUpdownward viewItem={mockViewItem} />
        </UIConfiguratorProvider>
      </StoreProvider>
    );

    expect(getByTestId('btn-up')).toBeInTheDocument()
    expect(getByTestId('btn-down')).toBeInTheDocument()

    // expect(getByRole('button', { name: /вверх/i })).toBeInTheDocument();
    // expect(getByRole('button', { name: /вниз/i })).toBeInTheDocument();
  });

  it('вызывает updateViewItems с правильным order при клике "вверх"', () => {
    const { updateViewItems } = useDashboardViewActions({ parentId: mockViewItem.parentId });
    const mockedStore: DeepPartial<StateSchema> = {
      user: {},
      dashboardView: {
        loading : false,
        errors  : {}
      }
    };
    const { user, debug, getByTestId, getByRole, getByText } = setupRender(
      <StoreProvider initialState={mockedStore}>
        <UIConfiguratorProvider>
          <MoveItemUpdownward viewItem={mockViewItem} />
        </UIConfiguratorProvider>
      </StoreProvider>
    );

    fireEvent.click(getByTestId('btn-up'));

    // Ожидаем, что order изменится с 1000 → 4000 (потому что item-2 имеет order=1)
    expect(updateViewItems).toHaveBeenCalledWith({
      id: 'item-1',
      order: 4000, // Новый order после перемещения вверх
    });
  });

  it('вызывает updateViewItems с правильным order при клике "вниз"', () => {
    const { updateViewItems } = useDashboardViewActions({ parentId: mockViewItem.parentId });
    const mockedStore: DeepPartial<StateSchema> = {
      user: {},
      dashboardView: {
        loading : false,
        errors  : {}
      }
    };
    const { user, debug, getByTestId, getByRole, getByText } = setupRender(
      <StoreProvider initialState={mockedStore}>
        <UIConfiguratorProvider>
          <MoveItemUpdownward viewItem={mockViewItem} />
        </UIConfiguratorProvider>
      </StoreProvider>
    );

    fireEvent.click(getByTestId('btn-down'));

    // Ожидаем, что order изменится с 2 → 3 (потому что item-3 имеет order=3)
    expect(updateViewItems).toHaveBeenCalledWith({
      id: 'item-1',
      order: 2500, // Новый order после перемещения вниз
    });
  });

  // it('не вызывает updateViewItems, если перемещение невозможно (граничные случаи)', () => {
  //   const viewItemFirst = { ...mockViewItem, order: 1 }; // Первый элемент (нельзя вверх)
  //   const viewItemLast = { ...mockViewItem, order: 3 };  // Последний элемент (нельзя вниз)

  //   const { updateViewItems } = useDashboardViewActions({ parentId: mockViewItem.parentId });

  //   const { rerender } = render(<MoveItemUpdownward viewItem={viewItemFirst} />);
  //   fireEvent.click(screen.getByRole('button', { name: /up/i }));
  //   expect(updateViewItems).not.toHaveBeenCalled(); // Не должно быть вызова

  //   rerender(<MoveItemUpdownward viewItem={viewItemLast} />);
  //   fireEvent.click(screen.getByRole('button', { name: /down/i }));
  //   expect(updateViewItems).not.toHaveBeenCalled(); // Не должно быть вызова
  // });
});

// npm run test:unit move-item-up-downward.test.tsx
