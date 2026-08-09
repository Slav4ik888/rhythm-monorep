// packages/frontend/src/entities/ui/index.ts

export type { ScreenFormats, MessageType, ReqDocFields } from './types';
export type { StateSchemaUI, PageLoadingType, PageLoading, PageLoadingItem } from './model/state-schema';
export { useUIStore, type UIStore } from './model/store';
export { useUI } from './model/hooks';
export { screenResizeListener } from './model/utils/screen-resize-listener';
