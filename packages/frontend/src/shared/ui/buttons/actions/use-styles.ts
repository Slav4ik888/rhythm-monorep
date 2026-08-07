import { f } from 'shared/styles';


export const useStyles = () => ({
  root: {
    ...f('c-fe'),
    mt : 4,
    py : 2
  },
  divider: {
    width : '100%',
    mb    : 4
  },
  content: {
    ...f('--sb'),
    width: '100%'
  }
});
