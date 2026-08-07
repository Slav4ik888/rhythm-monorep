import { SCHEMA_NAME } from 'shared/lib/validators/ajv/schemas';


export const definitions = {
  $id  : SCHEMA_NAME.DEFS_ITEM_BASE,
  type : 'object',

  definitions: {
    id: {
      type      : 'string',
      minLength : 20,
      maxLength : 20
    },

    parentId: {
      type  : 'string',
      oneOf : [
        { maxLength: 0 },
        {
          minLength : 20,
          maxLength : 20
        }
      ]
    },

    condition: {
      isCondition: 'string'
    },

    // Заголовок
    label: {
      type      : 'string',
      maxLength : 50
    },

    // Описание
    description: {
      type      : 'string',
      maxLength : 1000
    },

    // Additional field, for comment for this item
    comment: {
      type      : 'string',
      maxLength : 1000
    },

    // Сортировка среди своих же братьев
    // При перемещении к новому родителю, ставиться в начало списка
    order: {
      type    : 'number',
      minimum : 0,
      maximum : 10000000 // 10 000 000
    }
  }
};
