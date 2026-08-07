import { SCHEMA_NAME } from '../../schemas/schema-names';
import { getValidResult, isNotOneOfSeveral } from '../../../base';
import { getErrorText } from '../../../get-error-text';
import { ERROR_NAME } from '../../../get-error-text/error-text';


const schemasNames = Object.values(SCHEMA_NAME);

/** Check schemaName */
export const isValidSchemaName = (
  schemaName : SCHEMA_NAME,
  T?         : string // Titles // Translate schema  styles.document.structure.dialogTitle
) => {
  if (isNotOneOfSeveral(schemasNames, schemaName)) return getValidResult({
    general: getErrorText(ERROR_NAME.MUST_BE_ONE_OF_SEVERAL, schemaName)
  });

  return getValidResult();
};
