import { RgbaColor } from 'react-colorful';


export function rgba(color?: RgbaColor) {
  return `rgba(${color?.r}, ${color?.g}, ${color?.b}, ${color?.a})`;
}
