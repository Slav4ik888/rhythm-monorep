import { ItemBase } from 'entities/base';


export interface Position extends ItemBase {
  position      : string
  // Это должно храниться в DB в одном месте для всех
  // documents : string[] // Ids документов закреплённых за должностью
  // rules     : string[] // Ids правил закреплённых за должностью
}
