import { DashboardTemplatesEntities } from '../../../slice/state-schema';
import { ViewItem } from 'entities/dashboard-view';
import { findViewItemById } from '..';



describe('findViewItemById', () => {
  const mockViewItem1 = { id: 'item1', type: 'viewItem' } as unknown as ViewItem
  const mockViewItem2 = { id: 'item2', type: 'viewItem' } as unknown as ViewItem
  const mockViewItem3 = { id: 'item3', type: 'viewItem' } as unknown as ViewItem

  const mockEntities = {
    template1: {
      id: 'template1',
      type: 'type1',
      bunchId: 'bunch1',
      viewItems: {
        item1: mockViewItem1,
        item2: mockViewItem2
      }
    },
    template2: {
      id: 'template2',
      type: 'type2',
      bunchId: 'bunch2',
      viewItems: {
        item3: mockViewItem3
      }
    }
  } as unknown as DashboardTemplatesEntities

  it('should return undefined when selectedId is empty', () => {
    const result = findViewItemById(mockEntities, '')
    expect(result).toBeUndefined()
  })

  it('should return undefined when entities is empty', () => {
    const result = findViewItemById({}, 'item1')
    expect(result).toBeUndefined()
  })

  it('should return undefined when selectedId is not found', () => {
    const result = findViewItemById(mockEntities, 'nonExistentItem')
    expect(result).toBeUndefined()
  })

  it('should find viewItem when it exists in first template', () => {
    const result = findViewItemById(mockEntities, 'item1')
    expect(result).toEqual(mockViewItem1)
  })

  it('should find viewItem when it exists in second template', () => {
    const result = findViewItemById(mockEntities, 'item3')
    expect(result).toEqual(mockViewItem3)
  })

  it('should return the first found viewItem if duplicates exist', () => {
    const duplicateViewItem = { id: 'duplicateItem', type: 'viewItem' } as unknown as ViewItem
    const entitiesWithDuplicates: DashboardTemplatesEntities = {
      template1: {
        ...mockEntities.template1,
        viewItems: {
          ...mockEntities.template1.viewItems,
          duplicateItem: duplicateViewItem
        }
      },
      template2: {
        ...mockEntities.template2,
        viewItems: {
          ...mockEntities.template2.viewItems,
          duplicateItem: { id: 'duplicateItem', type: 'otherType' } as unknown as ViewItem
        }
      }
    }

    const result = findViewItemById(entitiesWithDuplicates, 'duplicateItem')
    expect(result).toEqual(duplicateViewItem)
  })

  it('should return undefined when viewItems are empty', () => {
    const emptyTemplate = {
      id: 'emptyTemplate',
      type: 'type',
      bunchId: 'bunch',
      viewItems: {}
    }
    const entities = { emptyTemplate }
    const result = findViewItemById(entities as unknown as DashboardTemplatesEntities, 'item1')
    expect(result).toBeUndefined()
  })

  it('should handle complex viewItems structure', () => {
    const complexViewItem = {
      id: 'complexItem',
      type: 'complexType',
      // другие возможные свойства ViewItem
    } as unknown as ViewItem
    const complexEntities = {
      complexTemplate: {
        id: 'complexTemplate',
        type: 'complexType',
        bunchId: 'complexBunch',
        viewItems: {
          complexItem: complexViewItem,
          otherItem: { id: 'otherItem', type: 'otherType' } as unknown as ViewItem
        }
      }
    } as unknown as DashboardTemplatesEntities

    const result = findViewItemById(complexEntities, 'complexItem')
    expect(result).toEqual(complexViewItem)
  })
});

// npm run test:unit find-view-item-by-id.test.ts
