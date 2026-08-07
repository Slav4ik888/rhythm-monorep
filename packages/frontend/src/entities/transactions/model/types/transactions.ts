import { Debug } from './debug';
import { Operation } from './operations';



export interface Transaction {
  id         : string
  debug      : Debug
  operations : Operation[]
}


/**
 * Основное требование и посыл, что если отправить этот запрос из любого места,
 * то всё должно получиться
 */
export interface RequestTransactions {
  requestId    : string
  transactions : Transaction[]
}
