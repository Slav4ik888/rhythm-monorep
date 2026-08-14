import { getBunchesForLoad } from '..';
import type { BunchesViewItem } from '../../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const item: any = { id: 'i-1' };

describe('getBunchesForLoad', () => {
  it('возвращает bunch с пустым содержимым, даже если timestamp свежий', () => {
    const result = getBunchesForLoad({ 'b-1': 200 }, { 'b-1': 200 }, { 'b-1': {} } as BunchesViewItem);
    expect(result).toEqual(['b-1']);
  });

  it('возвращает отсутствующий в LS bunch, даже если timestamp свежий', () => {
    const result = getBunchesForLoad({ 'b-1': 200 }, { 'b-1': 200 }, {} as BunchesViewItem);
    expect(result).toEqual(['b-1']);
  });

  it('возвращает устаревший по timestamp bunch', () => {
    const result = getBunchesForLoad({ 'b-1': 200 }, { 'b-1': 100 }, { 'b-1': { 'i-1': item } } as BunchesViewItem);
    expect(result).toEqual(['b-1']);
  });

  it('не возвращает ничего, если всё свежее и содержимое есть', () => {
    const result = getBunchesForLoad({ 'b-1': 200 }, { 'b-1': 200 }, { 'b-1': { 'i-1': item } } as BunchesViewItem);
    expect(result).toEqual([]);
  });

  it('дедуплицирует bunch, который и устарел, и пуст', () => {
    const result = getBunchesForLoad({ 'b-1': 200 }, { 'b-1': 100 }, { 'b-1': {} } as BunchesViewItem);
    expect(result).toEqual(['b-1']);
  });
});
