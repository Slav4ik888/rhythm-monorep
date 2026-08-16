// packages/frontend/src/features/company/dashboard-access/delete-member-icon-container/delete-member-icon-container.test.tsx
// Smoke/unit-тест удаления участника из доступа к дашборду.

import { screen, fireEvent } from '@testing-library/react';
import { renderPage } from 'shared/lib/tests/render-page';

import { DeleteMemberIconContainer } from './index';
import { updateCompany } from 'shared/api/features/company';
import { useCompanyStore } from 'entities/company';

jest.mock('shared/api/features/company', () => ({
  updateCompany: jest.fn(),
  getParamsCompany: jest.fn(),
  deleteSheet: jest.fn(),
}));

describe('DeleteMemberIconContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCompanyStore.setState({
      paramsCompany: {
        id: 'c1',
        dashboardMembers: [{ e: 'a@a.com' }, { e: 'b@b.com' }],
      },
    } as never);
  });

  it('рендерится без ошибок', () => {
    renderPage(<DeleteMemberIconContainer member={{ e: 'b@b.com' } as never} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('при клике удаляет участника из dashboardMembers и обновляет компанию', () => {
    renderPage(<DeleteMemberIconContainer member={{ e: 'b@b.com' } as never} />);

    fireEvent.click(screen.getByRole('button'));

    expect(updateCompany).toHaveBeenCalledTimes(1);
    expect(updateCompany).toHaveBeenCalledWith({
      id: 'c1',
      dashboardMembers: [{ e: 'a@a.com' }],
    });
  });
});
