// packages/backend/src/models/user/services/get/tests/set-verification.test.ts

import { serviceSetVerification } from '../set-verification';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { sendMail } from '../../../../../libs/emails';
import { cfg } from '../../../../../app/config';
import { CompanyStatus } from '../../../../company/types';
import { User, UserStatus } from '../../../types';
import { MOCK_USER_EMPLOYEE } from '../../../mocks';
import { createMockDocRef } from '../../../../tests/mocks/firestore';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefDoc: jest.fn(),
}));
// Мокаем отправку писем — реальный транспорт в тестах не нужен.
jest.mock('../../../../../libs/emails', () => ({
  sendMail: jest.fn(),
}));
// Мокаем firebase целиком: set-verification импортирует User из models/user/index.ts,
// который тянет сервисы → firebase.
jest.mock('../../../../../libs/firebase', () => ({ auth: {}, admin: {}, db: {} }));

const getRefDocMock = getRefDoc as jest.Mock;
const sendMailMock = sendMail as jest.Mock;

describe('serviceSetVerification', () => {
  it('обновляет компанию, пользователя и шлёт уведомление о подтверждении', async () => {
    const user: User = { ...MOCK_USER_EMPLOYEE };
    const companyDocRef = createMockDocRef();
    const userDocRef = createMockDocRef();
    getRefDocMock.mockImplementation((type: DbRef) => (type === DbRef.COMPANY ? companyDocRef : userDocRef));

    await serviceSetVerification(user);

    expect(user.emailVerified).toBe(true);
    expect(user.status).toBe(UserStatus.VERIFIED);

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.COMPANY, { companyId: user.companyId });
    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.USER, {
      companyId: user.companyId,
      userId: user.id,
    });

    expect(companyDocRef.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: user.companyId,
        status: CompanyStatus.VERIFIED,
        'lastChange.userId': user.id,
      }),
    );
    expect(userDocRef.update).toHaveBeenCalledWith(
      expect.objectContaining({
        emailVerified: true,
        status: UserStatus.VERIFIED,
      }),
    );

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: cfg.INFO_EMAIL,
        subject: `Подтвердили email ${user.email}`,
        template: 'info-email-verified',
        locals: {
          platform_name: cfg.SITE_TITLE_FULL,
          companyId: user.companyId,
          email: user.email,
        },
      }),
    );
  });
});
