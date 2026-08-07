import { FC } from 'react';
import Box from '@mui/material/Box';
import { useGroup } from '../../../../hooks';
import { isChangesInSubmit } from '../..';


type Props = {
  storeData : object
  newData   : object
  exit      : boolean
  onNull    : () => void
  onSubmit  : () => void
}

const Component: FC<Props> = ({ storeData, newData, exit, onNull, onSubmit }) => {
  const group = useGroup<unknown>();

  const handleSubmit = () => {
    if (! isChangesInSubmit(group, storeData, newData, exit)) return onNull();
    return onSubmit();
  };

  return (
    <Box id='id' onClick={handleSubmit} />
  );
};

export default Component;
