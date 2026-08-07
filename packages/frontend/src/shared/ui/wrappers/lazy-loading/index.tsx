import { FC, ReactNode, useEffect, useState } from 'react';



interface Props {
  open     : boolean
  children : ReactNode
}

/** For lazy loading components */
export const WrapperLazyLoading: FC<Props> = ({ open, children }) => {
  const
    [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    if (open) {
      setIsMounted(true);
    }

    return () => setIsMounted(false)
  }, [open]);

  if (! isMounted) return null;


  return (
    <>
      {children}
    </>
  );
};
