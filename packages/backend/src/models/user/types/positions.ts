import { ItemBase } from '../../base';


export interface Position extends ItemBase {
  // Это должно храниться в DB в одном месте для всех
  // documents : string[] // Ids документов закреплённых за должностью
  // rules     : string[] // Ids правил закреплённых за должностью
}
