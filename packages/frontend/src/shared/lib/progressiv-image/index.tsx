/* eslint-disable react/jsx-curly-newline */
import Box from '@mui/material/Box';
import { FC, useEffect, useRef, useState } from 'react';
import { SxCard } from 'shared/styles';
import { Tooltip } from 'shared/ui/tooltip';



interface Props {
  src          : string
  placeholder? : string
  toolTitle?   : string
  alt          : string
  sx           : SxCard
}

export const ProgressiveImage: FC<Props> = ({ src, placeholder, alt, sx, toolTitle = '' }) => {
  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (! imgRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoaded) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setIsLoaded(true);
          };
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  },
    [src, isLoaded]
  );


  return (
    <Tooltip title={toolTitle}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          ...sx?.root,
        }}
      >
        <Box
          component = 'img'
          ref       = {imgRef}
          src       = {isLoaded
                        ? src
                        : placeholder ? placeholder : src
                      }
          alt       = {alt}
          sx        = {{
            width      : '100%',
            height     : 'auto',
            filter     : isLoaded ? 'none' : 'blur(10px)',
            transition : 'filter 0.5s ease-out',
            ...sx?.content,
          }}
        />
      </Box>
    </Tooltip>
  );
}
