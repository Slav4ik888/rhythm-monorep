// packages/frontend/src/entities/dashboard-view/index.ts

export type {
  ViewItemId,
  ViewItem,
  BorderStyleType,
  FlexDirectionType,
  FlexWrapType,
  AlignItemsType,
  JustifyContentType,
  ViewItemStyles,
  ViewItemStylesField,
  PartialViewItem,
  RgbaString,
  FontStyleType,
  FontWeightType,
  ViewItemSettings,
  ViewItemSettingsField,
  ChipType,
  BaseChipType,
  IndicatorsConfig,
  EndingType,
  EndingDiffType,
  ViewItemType,
  TextAlignType,
  TextWrapType,
  GaugeColumnItem,
  SettingsDirection,
  GaugeValueType,
  PeriodItem,
  Periods,
} from './types';
export {
  arrayBorderStyles,
  arrayFontStyles,
  arrayFontWeights,
  arrayTextWrap,
  arrayChipLabel,
  chipOptions,
  arrayEndingType,
  arrayEndingDiffType,
  arraySettingsDirection,
  arrayGaugeValueType,
} from './consts';
export type { DashboardViewEntities, StateSchemaDashboardView, ActivatedCopiedType } from './model/state-schema';
/** @deprecated используйте ActivatedCopiedType */
export type { ActivatedCopiedType as ActivatedCopied } from './model/state-schema';
export type {
  SetDashboardViewItems,
  SetEditMode,
  SetDashboardBunchesFromCache,
  ChangeOneChartsItem,
  ChangeOneDatasetsItem,
  ChangeOneSettingsField,
  ChangeSelectedStyle,
} from './model/state-schema';
export {
  getInitialState,
  stylesToSx,
  createNextOrder,
  getKod,
  isFirstGlobalKodInBranch,
  getChildren,
  isClickInsideViewItem,
  getBunchesToUpdate,
  getBunchesForLoad,
  getParents,
  getFirstItemInBranchWithGlobalKod,
} from './model/utils';
export type { ParentsViewItems } from './model/utils';
export { useDashboardViewState, useDashboardViewActions } from './model/hooks';
export { useDashboardViewStore } from './model/store';
export type { DashboardViewStore } from './model/store';
export type { ReqGetBunches } from './model/services';
export { createViewItem } from './creators';
export { NO_SHEET_ID, NO_PARENT_ID, ORDER_STEP, MAX_COUNT_BUNCH_VIEWITEMS } from './consts';
export { ChipContainer } from './ui';
export type { SxChipContainer } from './ui';
