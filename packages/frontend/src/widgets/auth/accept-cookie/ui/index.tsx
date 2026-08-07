import { ChangeEvent, FC, memo, useState } from 'react';
import { useUI } from 'entities/ui';
import { AcceptCookieComponent } from './component';



/**
 * Ask user about permission accept use cookie
 */
const AcceptCookieLogics: FC = memo(() => {
  const
    { acceptedCookie, setAcceptedCookie } = useUI(),
    [check, setCheck] = useState(false),
    handlerChange     = (e: ChangeEvent<HTMLInputElement>) => setCheck(e.target.checked),
    handlerAccept     = () => setAcceptedCookie(true);


  if (acceptedCookie) return null;


  return (
    <AcceptCookieComponent
      check    = {check}
      onChange = {handlerChange}
      onAccept = {handlerAccept}
    />
  );
});


export default AcceptCookieLogics;
