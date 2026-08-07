import { invertData } from './invert-data'



/** Делает invertData (если нужно) */
export const checkInvertData = (inverted: boolean,  data: number[]): number[] => {
  if (! data) return []

  return inverted
    ? invertData(data)
    : data
}
