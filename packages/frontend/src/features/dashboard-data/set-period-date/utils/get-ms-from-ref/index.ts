import { MutableRefObject } from 'react';


export const getMsFromRef = (ref: MutableRefObject<HTMLInputElement>) => new Date(ref?.current?.value)?.getTime()
