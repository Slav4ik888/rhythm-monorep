import { Mocks } from "./types";

export const mocks: Mocks = [
  [{ description: `number 12`,     value: 12},        12],
  [{ description: `number 12.456`, value: 12.456},    12.456],
  [{ description: `string 12.456`, value: `12.456`},  12.456],
  [{ description: `string 12,456`, value: `12,456`},  12.456],
  [{ description: `undefined`,     value: undefined}, 0],
  [{ description: `null`,          value: null},      0],
  [{ description: `NaN`,           value: NaN},       0],
  [{ description: `false`,         value: false},     0],
  [{ description: `true`,          value: true},      0],
];
