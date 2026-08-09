// packages/frontend/src/shared/lib/tests/store/index.tsx
// Заглушка после удаления Redux StoreProvider

import type { FC, ReactNode } from 'react';

const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;

export { StoreProvider };
