// packages/frontend/src/features/company/dashboard-access/add-user/container/actions/index.tsx

import { FC, forwardRef, MutableRefObject, useCallback, useMemo } from 'react';
import { MDButton } from 'shared/ui/mui-design-components';
import { f } from 'shared/styles';
import Box from '@mui/material/Box';
import { ErrorBox } from 'shared/ui/containers';
import { isEmpty, isNotEmpty } from 'shared/helpers/objects';
import { CompanyDashboardMember, AccessLevel, useCompany } from 'entities/company';
import { updateArrWithItemByField } from 'shared/helpers/arrays';
import { isNotEmail } from 'shared/lib/validators';
import { __devLog } from 'shared/lib/tests/__dev-log';

interface Props {
  selectedEmail: string;
  existingEmail: CompanyDashboardMember | undefined;
  selectedAccessLevel: AccessLevel;
  ref: MutableRefObject<HTMLInputElement | null>;
  setSelectedEmail: (email: string) => void;
}

// Define props without 'ref' for forwardRef compatibility
type ActionsProps = Omit<Props, 'ref'>;

// @ts-ignore
export const Actions: FC<Props> = forwardRef<null, ActionsProps>(
  ({ selectedEmail, selectedAccessLevel, existingEmail, setSelectedEmail }, ref) => {
    const { loading, errors, paramsCompany, paramsChangedCompany, setErrors, serviceUpdateCompany } = useCompany();

    const disabled = useMemo(
      () =>
        isEmpty(paramsChangedCompany) && // Чтобы засечь когда удалили email
        (loading || isNotEmpty(errors) || isNotEmail(selectedEmail) || !selectedEmail),
      [loading, errors, paramsChangedCompany, selectedEmail],
    );

    const handleSubmit = useCallback(() => {
      if (disabled) return __devLog('features/company/add-user/actions', 'disabled!!!!'); // По идее этой ситуации не должно быть
      if (isNotEmail(selectedEmail)) return setErrors({ email: 'Некорректный email' });

      // TODO: checkAccess к данной операции

      // Если пользователь уже есть в системе, то сохраняем его имеющиеся права
      const access = {
        ...existingEmail,
        e: selectedEmail,
        a: {
          ...existingEmail?.a,
          f: selectedAccessLevel, // 'e'
        },
      } as CompanyDashboardMember;

      const dashboardMembers = updateArrWithItemByField(paramsCompany.dashboardMembers, 'e', access);

      serviceUpdateCompany({ id: paramsCompany.id, dashboardMembers });
      // @ts-ignore
      const inputRef = ref as unknown as MutableRefObject<HTMLInputElement> | null;
      if (inputRef?.current) {
        inputRef.current.value = '';
      }
      setSelectedEmail('');
    }, [
      selectedEmail,
      selectedAccessLevel,
      existingEmail,
      paramsCompany,
      disabled,
      ref,
      serviceUpdateCompany,
      setErrors,
      setSelectedEmail,
    ]);

    if (disabled) return null;

    return (
      <Box sx={{ ...f('c'), width: '100%', my: 2 }}>
        <ErrorBox field='general' errors={errors} sx={{ root: { mb: 2 } }} />
        <MDButton
          loading={loading}
          disabled={disabled}
          color={loading || isNotEmpty(errors) ? 'text' : 'primary'}
          variant='outlined'
          children='Сохранить'
          onClick={handleSubmit}
        />
      </Box>
    );
  },
);
