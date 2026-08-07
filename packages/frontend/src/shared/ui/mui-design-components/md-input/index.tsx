/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { forwardRef, FC } from 'react';
import MDInputRoot from './md-input-root';



interface Props {
  id?       : string
  error?    : boolean
  success?  : boolean
  disabled? : boolean
  label?    : string
}

const MDInput: FC<Props> = forwardRef(({ error, success, disabled, ...rest }, ref) => (
  // @ts-ignore
  <MDInputRoot
    {...rest}
    // @ts-ignore
    inputRef={ref}
    InputLabelProps={{ shrink: true }}
    ownerState={{ error, success, disabled }}
  />
));


export default MDInput;
