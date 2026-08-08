// packages/frontend/src/entities/ui/index.ts

export type { ScreenFormats, MessageType, ReqDocFields } from './types';
export type { StateSchemaUI, PageLoadingType, PageLoadingValue } from './model/slice/state-schema';
export { useUIStore, type UIStore } from './model/store';
export { useUI } from './model/hooks';
export { actions as actionsUI, reducer as reducerUI } from './model/slice'; // Устаревшие, удалить после миграции
export { screenResizeListener } from './model/utils/screen-resize-listener';
