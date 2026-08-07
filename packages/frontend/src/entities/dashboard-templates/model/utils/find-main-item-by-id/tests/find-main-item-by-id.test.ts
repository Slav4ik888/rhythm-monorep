import { Template } from '../../../types';
import { ViewItem } from 'entities/dashboard-view';
import { findMainViewItemById } from '..';
import { DashboardTemplatesEntities } from '../../../slice/state-schema';
import { findTemplateBySelectedId } from '../../find-template-by-selected-id';



// Мокаем findTemplateBySelectedId для изоляции тестов
jest.mock('../../find-template-by-selected-id', () => ({
  findTemplateBySelectedId: jest.fn()
}))

describe('findMainViewItemById', () => {
  const mockMainViewItem = {
    id: 'mainItem',
    type: 'box',
    parentId: 'template1'
  } as unknown as ViewItem;

  const mockChildViewItem = {
    id: 'childItem',
    type: 'childType',
    parentId: 'mainItem'
  } as unknown as ViewItem

  const mockTemplate = {
    id: 'template1',
    type: 'box',
    bunchId: 'bunch1',
    viewItems: {
      mainItem: mockMainViewItem,
      childItem: mockChildViewItem
    }
  } as unknown as Template;

  const mockEntities: DashboardTemplatesEntities = {
    template1: mockTemplate
  };

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return undefined when selectedId is empty', () => {
    const result = findMainViewItemById(mockEntities, '')
    expect(result).toBeUndefined()
    expect(findTemplateBySelectedId).not.toHaveBeenCalled()
  })

  it('should return undefined when entities is empty', () => {
    const result = findMainViewItemById({}, 'someId')
    expect(result).toBeUndefined()
  })

  it('should return undefined when template is not found', () => {
    (findTemplateBySelectedId as jest.Mock).mockReturnValue(undefined)
    const result = findMainViewItemById(mockEntities, 'nonExistentId')
    expect(result).toBeUndefined()
    expect(findTemplateBySelectedId).toHaveBeenCalledWith(mockEntities, 'nonExistentId')
  })

  it('should return main view item when it exists', () => {
    (findTemplateBySelectedId as jest.Mock).mockReturnValue(mockTemplate)
    const result = findMainViewItemById(mockEntities, 'childItem')
    expect(result).toEqual(mockMainViewItem)
    expect(findTemplateBySelectedId).toHaveBeenCalledWith(mockEntities, 'childItem')
  })

  it('should return undefined when main view item does not exist', () => {
    const templateWithoutMainItem: Template = {
      ...mockTemplate,
      viewItems: {
        childItem: mockChildViewItem
      }
    } as unknown as Template
    (findTemplateBySelectedId as jest.Mock).mockReturnValue(templateWithoutMainItem)

    const result = findMainViewItemById(mockEntities, 'childItem')
    expect(result).toBeUndefined()
  })

  it('should handle multiple potential main items (return first found)', () => {
    const anotherMainItem: ViewItem = {
      id: 'anotherMainItem',
      type: 'box',
      parentId: 'template1'
    } as unknown as ViewItem

    const templateWithMultipleMains = {
      ...mockTemplate,
      viewItems: {
        ...mockTemplate.viewItems,
        anotherMainItem
      }
    } as unknown as Template

    (findTemplateBySelectedId as jest.Mock).mockReturnValue(templateWithMultipleMains)

    const result = findMainViewItemById(mockEntities, 'childItem')
    // Должен вернуть первый найденный main item
    expect([mockMainViewItem, anotherMainItem]).toContainEqual(result)
  })

  it('should return undefined when viewItems are empty', () => {
    const emptyTemplate: Template = {
      ...mockTemplate,
      viewItems: {}
    } as unknown as Template;
    (findTemplateBySelectedId as jest.Mock).mockReturnValue(emptyTemplate)

    const result = findMainViewItemById(mockEntities, 'someId')
    expect(result).toBeUndefined()
  })

  it('should handle complex template structures', () => {
    const complexMainItem: ViewItem = {
      id: 'complexMain',
      type: 'complexType',
      parentId: 'template1',
      // другие свойства если есть
    } as unknown as ViewItem;

    const complexTemplate: Template = {
      ...mockTemplate,
      viewItems: {
        complexMain: complexMainItem,
        nestedItem: {
          id: 'nestedItem',
          type: 'nestedType',
          parentId: 'complexMain'
        }
      }
    } as unknown as Template;

    (findTemplateBySelectedId as jest.Mock).mockReturnValue(complexTemplate)

    const result = findMainViewItemById(mockEntities, 'nestedItem')
    expect(result).toEqual(complexMainItem)
  })
})


// npm run test:unit find-main-item-by-id.test.ts
