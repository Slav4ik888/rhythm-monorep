// packages/frontend/src/entities/ui/model/store.ts

import { create } from 'zustand';
import cfg from 'app/config';
import { LS } from 'shared/lib/local-storage';
import { Errors } from 'shared/lib/validators';
import type { Message } from '../types/messages';
import { MessageType } from '../types/messages';
import { getScreenFormats, getScreenSize, isAcceptCookie } from './utils';
import type { PageLoading, PageLoadingType, StateSchemaUI } from './state-schema';

const initialState: StateSchemaUI = {
  loading: false,
  pageLoading: {},
  errors: {},
  errorStatus: 0,
  message: {} as Message,
  screenFormats: getScreenFormats(getScreenSize()),
  screenSize: getScreenSize(),
  replacePath: '',
  acceptedCookie: isAcceptCookie(),
};

interface UIActions {
  // UI
  setErrors: (errors: Errors) => void;
  setErrorStatus: (status: number, pathname?: string) => void;

  // Page Loader
  setPageLoading: (payload?: PageLoading) => void;

  // Messages
  setMessage: (message: Message) => void;
  setInfoMessage: (message: string) => void;
  setSuccessMessage: (message: string) => void;
  setWarningMessage: (message: string) => void;
  setErrorMessage: (message: string) => void;
  clearMessage: () => void;

  // Screens
  setScreenFormats: (size: number) => void;
  setScreenSize: (size: number) => void;

  // Settings
  setReplacePath: (path: string) => void;
  clearReplacePath: () => void;
  setAcceptedCookie: (value: boolean) => void;
}

export type UIStore = StateSchemaUI & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  ...initialState,

  setErrors: (errors) => set({ errors, pageLoading: {} }),
  setErrorStatus: (status, pathname) =>
    set((state) => ({
      errorStatus: status,
      replacePath: pathname ?? state.replacePath,
      pageLoading: {},
    })),

  // Page Loader
  setPageLoading: (payload) =>
    set((state) => {
      if (!payload) return { pageLoading: {} };

      const newPageLoading = { ...state.pageLoading };
      Object.entries(payload).forEach(([key, value]) => {
        if (!value.text) {
          delete newPageLoading[key as PageLoadingType];
        } else {
          newPageLoading[key as PageLoadingType] = value;
        }
      });

      return { pageLoading: newPageLoading };
    }),

  // Messages
  setMessage: (message) => set({ message }),
  setInfoMessage: (payload) =>
    set({
      message: { type: MessageType.INFO, message: payload, timeout: cfg.DEFAULT_MESSAGE_TIMEOUT },
    }),
  setSuccessMessage: (payload) =>
    set({
      message: { type: MessageType.SUCCESS, message: payload, timeout: cfg.DEFAULT_MESSAGE_TIMEOUT },
    }),
  setWarningMessage: (payload) =>
    set({
      message: { type: MessageType.WARNING, message: payload, timeout: cfg.DEFAULT_MESSAGE_TIMEOUT },
    }),
  setErrorMessage: (payload) =>
    set({
      message: { type: MessageType.ERROR, message: payload, timeout: cfg.DEFAULT_MESSAGE_TIMEOUT },
    }),
  clearMessage: () => set({ message: {} as Message }),

  // Screens
  setScreenFormats: (size) => set({ screenFormats: getScreenFormats(size), screenSize: size }),
  setScreenSize: (size) => set({ screenSize: size }),

  // Settings
  setReplacePath: (path) => set({ replacePath: path }),
  clearReplacePath: () => set({ replacePath: '' }),
  setAcceptedCookie: (value) => {
    LS.setAcceptedCookie();
    set({ acceptedCookie: value });
  },
}));
