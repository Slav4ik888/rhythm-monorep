// packages/frontend/src/entities/ui/model/state-schema.ts

import type { Errors } from 'shared/lib/validators';
import type { Message } from '../types/messages';
import type { ScreenFormats } from '../types';

export type PageLoadingType = string;

export interface PageLoadingItem {
  text: string;
  name?: string;
}

export interface PageLoading {
  [key: PageLoadingType]: PageLoadingItem;
}

export interface StateSchemaUI {
  loading: boolean;
  pageLoading: PageLoading;
  errors: Errors;
  errorStatus: number;
  message: Message;
  screenFormats: ScreenFormats;
  screenSize: number;
  replacePath: string;
  acceptedCookie: boolean;
}
