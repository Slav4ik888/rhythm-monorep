import { findTemplateBySelectedId } from '..';
import { Template } from '../../../types';
import { DashboardTemplatesEntities } from '../../../slice/state-schema';



describe('findTemplateBySelectedId', () => {
  const mockTemplate1 = {
    id: 'template1',
    type: 'type1',
    bunchId: 'bunch1',
    viewItems: {
      item1: { id: 'item1', type: 'viewItem' },
      item2: { id: 'item2', type: 'viewItem' }
    }
  } as unknown as Template;

  const mockTemplate2 = {
    id: 'template2',
    type: 'type2',
    bunchId: 'bunch2',
    viewItems: {
      item3: { id: 'item3', type: 'viewItem' },
      item4: { id: 'item4', type: 'viewItem' }
    }
  } as unknown as Template;


  const mockEntities: DashboardTemplatesEntities = {
    template1: mockTemplate1,
    template2: mockTemplate2
  }

  it('should return undefined when selectedId is empty', () => {
    const result = findTemplateBySelectedId(mockEntities as unknown as DashboardTemplatesEntities, '')
    expect(result).toBeUndefined()
  })

  it('should return undefined when entities is empty', () => {
    const result = findTemplateBySelectedId({}, 'item1')
    expect(result).toBeUndefined()
  })

  it('should return undefined when selectedId is not found', () => {
    const result = findTemplateBySelectedId(mockEntities as unknown as DashboardTemplatesEntities, 'nonExistentItem')
    expect(result).toBeUndefined()
  })

  it('should find template when selectedId exists in first template', () => {
    const result = findTemplateBySelectedId(mockEntities as unknown as DashboardTemplatesEntities, 'item1')
    expect(result).toEqual(mockTemplate1)
  })

  it('should find template when selectedId exists in second template', () => {
    const result = findTemplateBySelectedId(mockEntities as unknown as DashboardTemplatesEntities, 'item3')
    expect(result).toEqual(mockTemplate2)
  })

  it('should return undefined when viewItems is empty', () => {
    const emptyTemplate = {
      id: 'emptyTemplate',
      type: 'type',
      bunchId: 'bunch',
      viewItems: {}
    } as unknown as Template;
    const entities = { emptyTemplate }
    const result = findTemplateBySelectedId(entities as unknown as DashboardTemplatesEntities, 'item1')
    expect(result).toBeUndefined()
  })

  it('should handle multiple templates and find the correct one', () => {
    const mockTemplate3 = {
      id: 'template3',
      type: 'type3',
      bunchId: 'bunch3',
      viewItems: {
        item5: { id: 'item5', type: 'viewItem' },
        item6: { id: 'item6', type: 'viewItem' }
      }
    } as unknown as Template;
    const entities = { ...mockEntities, template3: mockTemplate3 }

    const result1 = findTemplateBySelectedId(entities as unknown as DashboardTemplatesEntities, 'item2')
    expect(result1).toEqual(mockTemplate1)

    const result2 = findTemplateBySelectedId(entities as unknown as DashboardTemplatesEntities, 'item6')
    expect(result2).toEqual(mockTemplate3)
  })
});


// npm run test:unit find-template-by-selected-id.test.ts
