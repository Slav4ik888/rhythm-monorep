// packages/frontend/config/jest/setup-tests.ts

import '@testing-library/jest-dom';
import 'regenerator-runtime/runtime';
import { TextEncoder, TextDecoder } from 'util';

// react-router v7 использует TextEncoder/TextDecoder на этапе загрузки модуля,
// но в jsdom-окружении jest они не определены — полифилим из node:util
Object.assign(globalThis, { TextEncoder, TextDecoder });

// jsdom не реализует window.matchMedia, а isDarkMode в useUI его вызывает
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList,
});

// Мок UIConfiguratorController для тестов, которые не обёрнуты в UIConfiguratorProvider
// (action-main-*.test.tsx, move-item-*.test.tsx)
jest.mock('app/providers/theme/model/hooks/use-ui-configurator-controller', () => ({
  useUIConfiguratorController: () => [
    {
      mode: 'light',
      navbarTransparent: false,
      navbarFixed: true,
      sidebarMini: false,
      isMobileOpenSidebar: false,
    },
    jest.fn(),
  ],
}));

// jsdom не реализует IntersectionObserver — его использует ProgressiveImage
// (lazy loading изображений) в footer, navbar, sidebar, demo-страницах.
// Используем фабрику-функцию (а не class), чтобы не нарушать max-classes-per-file.
Object.assign(globalThis, {
  IntersectionObserver: function IntersectionObserver() {
    return {
      root: null,
      rootMargin: '',
      thresholds: [],
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: jest.fn(() => []),
    };
  },
});

// jsdom не реализует ResizeObserver — его использует HintContainer для отслеживания
// размеров целевого элемента подсказки.
Object.assign(globalThis, {
  ResizeObserver: function ResizeObserver() {
    return {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };
  },
});

// react-helmet-async требует HelmetProvider в дереве компонентов; в тестах
// страниц он не поднимается, поэтому подменяем на пассивную реализацию.
jest.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children?: React.ReactNode }) => children ?? null,
  HelmetProvider: ({ children }: { children?: React.ReactNode }) => children ?? null,
}));
