
export function preserveNaNPositions(originalArray: number[], calculatedArray: number[]): number[] {
  const firstValidIndex = originalArray.findIndex(item => !isNaN(item));
  const lastValidIndex = originalArray.length - 1 - [...originalArray].reverse().findIndex(item => !isNaN(item));

  if (firstValidIndex === -1) return [...originalArray];

  return [
      ...originalArray.slice(0, firstValidIndex),
      ...calculatedArray,
      ...originalArray.slice(lastValidIndex + 1)
  ];
}
