
/** Уменьшает толщину круглешка на линии графика, если много значений */
export const fixPointRadius = (dates: any[]): number => {
  if (dates?.length > 30) return 0
  if (dates?.length > 20) return 2
  if (dates?.length > 13) return 3
  return 4
}
