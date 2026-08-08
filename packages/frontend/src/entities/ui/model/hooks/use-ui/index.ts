// packages/frontend/src/entities/ui/model/hooks/use-ui/index.ts

import { useUIStore } from '../../store';
import type { Message } from '../../../types';
import { useMemo } from 'react';
import type { PageLoading } from '../../slice/state-schema';
import { isDarkMode, useUIConfiguratorController } from 'app/providers/theme';
import { isGreaterMd as isGreaterMdFn } from '../../utils';

export const useUI = () => {
  const loading = useUIStore((s) => s.loading),
    pageLoading = useUIStore((s) => s.pageLoading),
    errors = useUIStore((s) => s.errors),
    errorStatus = useUIStore((s) => s.errorStatus),
    message = useUIStore((s) => s.message),
    screenFormats = useUIStore((s) => s.screenFormats),
    screenSize = useUIStore((s) => s.screenSize),
    acceptedCookie = useUIStore((s) => s.acceptedCookie),
    replacePath = useUIStore((s) => s.replacePath),
    // Actions
    setPageLoading = useUIStore((s) => s.setPageLoading),
    setErrors = useUIStore((s) => s.setErrors),
    setErrorStatus = useUIStore((s) => s.setErrorStatus),
    setMessage = useUIStore((s) => s.setMessage),
    setSuccessMessage = useUIStore((s) => s.setSuccessMessage),
    setWarningMessage = useUIStore((s) => s.setWarningMessage),
    clearMessage = useUIStore((s) => s.clearMessage),
    setScreenFormat = useUIStore((s) => s.setScreenFormats),
    setAcceptedCookie = useUIStore((s) => s.setAcceptedCookie),
    setReplacePath = useUIStore((s) => s.setReplacePath),
    clearReplacePath = useUIStore((s) => s.clearReplacePath);

  const [configuratorState, dispatchConfigurator] = useUIConfiguratorController();
  const { navbarTransparent, navbarFixed, mode, sidebarMini, isMobileOpenSidebar } = configuratorState;
  const darkMode = isDarkMode(mode);

  const isGreaterMd = isGreaterMdFn(screenFormats);
  const isMobile = screenFormats?.isMobile;

  const api = useMemo(
    () => ({
      setPageLoading,
      setErrors,
      setErrorStatus: (status: number) => setErrorStatus(status),
      setMessage,
      setSuccessMessage,
      setWarningMessage,
      clearMessage,
      setScreenFormat,
      setAcceptedCookie,
      setReplacePath,
      clearReplacePath,
    }),
    [
      setPageLoading,
      setErrors,
      setErrorStatus,
      setMessage,
      setSuccessMessage,
      setWarningMessage,
      clearMessage,
      setScreenFormat,
      setAcceptedCookie,
      setReplacePath,
      clearReplacePath,
    ],
  );

  return {
    loading,
    pageLoading,
    errors,
    errorStatus,
    message,
    darkMode,
    mode,
    sidebarMini,
    navbarTransparent,
    navbarFixed,
    configuratorState,
    isMobileOpenSidebar,
    dispatchConfigurator,
    screenFormats,
    screenSize,
    isGreaterMd,
    isMobile,
    acceptedCookie,
    replacePath,
    ...api,
  };
};
