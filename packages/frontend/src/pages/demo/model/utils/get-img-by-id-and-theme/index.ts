import demoPecarColorsNightPh from '../../assets/demo-pecar-colors-night-ph.png';
import demoPecarColorsNight from '../../assets/demo-pecar-colors-night.png';
import demoPecarColorsDayPh from '../../assets/demo-pecar-colors-day-ph.png';
import demoPecarColorsDay from '../../assets/demo-pecar-colors-day.png';

import demoPecarLightNightPh from '../../assets/demo-pecar-light-night-ph.png';
import demoPecarLightNight from '../../assets/demo-pecar-light-night.png';
import demoPecarLightDayPh from '../../assets/demo-pecar-light-day-ph.png';
import demoPecarLightDay from '../../assets/demo-pecar-light-day.png';


export const getImgByIdAndTheme = (id: number, darkMode: boolean) => {
  if (darkMode) {
    switch (id) {
      case 1: return { src: demoPecarColorsNight, ph: demoPecarColorsNightPh };
      case 2: return { src: demoPecarLightNight, ph: demoPecarLightNightPh };
      default: return { src: '', ph: '' };
    }
  }
  else {
    switch (id) {
      case 1: return { src: demoPecarColorsDay, ph: demoPecarColorsDayPh };
      case 2: return { src: demoPecarLightDay, ph: demoPecarLightDayPh };
      default: return { src: '', ph: '' };
    }
  }
};
