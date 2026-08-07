import { ViewItem } from '../../../../types';
import { getBunchesTimestamps } from '..';



describe('getBunchesTimestamps', () => {
  const mockTimestamp = 1234567890;

  it('должна возвращать пустой объект, если items undefined', () => {
    // @ts-ignore
    const result = getBunchesTimestamps(undefined, mockTimestamp);
    expect(result).toEqual({});
  });

  it('должна возвращать пустой объект, если items пуст', () => {
    const result = getBunchesTimestamps([], mockTimestamp);
    expect(result).toEqual({});
  });

  it('должна добавлять timestamp для каждого уникального bunchId', () => {
    const items: ViewItem[] = [
      { bunchId: 'bunch1' } as ViewItem,
      { bunchId: 'bunch2' } as ViewItem,
      { bunchId: 'bunch1' } as ViewItem, // дубликат
    ];

    const result = getBunchesTimestamps(items, mockTimestamp);
    expect(result).toEqual({
      bunch1: mockTimestamp,
      bunch2: mockTimestamp,
    });
  });

  it('не должна перезаписывать существующие timestamp для повторяющихся bunchId', () => {
    const items: ViewItem[] = [
      { bunchId: 'bunch1' } as ViewItem,
      { bunchId: 'bunch1' } as ViewItem,
      { bunchId: 'bunch1' } as ViewItem,
    ];

    const result = getBunchesTimestamps(items, mockTimestamp);
    expect(result).toEqual({
      bunch1: mockTimestamp,
    });
  });

  it('должна корректно обрабатывать разные bunchId', () => {
    const items: ViewItem[] = [
      { bunchId: 'bunchA' } as ViewItem,
      { bunchId: 'bunchB' } as ViewItem,
      { bunchId: 'bunchC' } as ViewItem,
    ];

    const result = getBunchesTimestamps(items, mockTimestamp);
    expect(result).toEqual({
      bunchA: mockTimestamp,
      bunchB: mockTimestamp,
      bunchC: mockTimestamp,
    });
  });

  it('должна использовать переданный timestamp', () => {
    const customTimestamp = 987654321;
    const items: ViewItem[] = [
      { bunchId: 'bunch1' } as ViewItem,
    ];

    const result = getBunchesTimestamps(items, customTimestamp);
    expect(result).toEqual({
      bunch1: customTimestamp,
    });
  });
});

// npm run test:unit get-bunches-timestamps.test.ts
