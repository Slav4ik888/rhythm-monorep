
export const useStyles = (sx: any | undefined, length?: number) => ({
  field: {
    width           : '100%',
    // minHeight       : '56px',
    border          : '1px solid #c4c4c4',
    borderRadius    : '4px',
    padding         : '12px',
    fontSize        : '1rem',
    fontFamily      : '"Roboto","Helvetica","Arial",sans-serif',
    ...sx?.field as object
  },
  hiddenLabelBG: {
    position  : 'absolute',
    top       : '0px',
    left      : '6px',
    px        : '5px',
    borderTop : `1px solid ${sx?.hiddenLabel?.backgroundColor || '#ffffff'}`,
    width     : () => (length as number) * 8
  },
  label: {
    position : 'absolute',
    top      : '-11px',
    left     : '4px',
    px       : '5px',
    fontSize : '0.8rem',
    color    : 'rgb(0 0 0 / 60%)',
    ...sx?.label
  }
});
