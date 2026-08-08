// packages/frontend/src/shared/lib/tests/setup-render/index.ts

import userEvent, { UserEvent } from '@testing-library/user-event';
import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';

type SetupRender = { user: UserEvent } & RenderResult;

// setup render function with userEvent
export function setupRender(jsx: ReactElement): SetupRender {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}
