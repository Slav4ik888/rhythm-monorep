import { FC, ReactNode, useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { useUIConfiguratorController } from 'app/providers/theme';
import { useDashboardViewState } from 'entities/dashboard-view';



interface Props {
  children : ReactNode
  onClick  : () => void
}

export const DashboardBodyContentWrapper: FC<Props> = ({ children, onClick }) => {
  const { editMode } = useDashboardViewState();
  const [configuratorState] = useUIConfiguratorController();
  const { leftOffsetScrollButton } = configuratorState;

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [thumbPosition, setThumbPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);

  // Обновление размеров скроллбара
  const updateScrollbar = () => {
    if (!contentRef.current) return;

    const { scrollWidth, clientWidth, scrollLeft } = contentRef.current;
    const trackWidth = clientWidth;

    // Рассчитываем ширину ползунка
    const newThumbWidth = Math.max(20, (clientWidth / scrollWidth) * trackWidth);
    setThumbWidth(newThumbWidth);

    // Рассчитываем позицию ползунка
    const newThumbPosition = (scrollLeft / (scrollWidth - clientWidth)) * (trackWidth - newThumbWidth);
    setThumbPosition(newThumbPosition);
  };

  // Обработчик скролла контента
  const handleScroll = () => {
    updateScrollbar();
  };

  // Начало перетаскивания ползунка
  const startDrag = (e: React.MouseEvent) => {
    if (!contentRef.current) return;

    setIsDragging(true);
    setStartX(e.clientX);
    setStartScrollLeft(contentRef.current.scrollLeft);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  // Перетаскивание ползунка
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !contentRef.current) return;

    const deltaX = e.clientX - startX;
    const { scrollWidth, clientWidth } = contentRef.current;
    const trackWidth = clientWidth;
    const scrollableWidth = scrollWidth - clientWidth;

    const newScrollLeft = Math.min(
      Math.max(0, startScrollLeft + (deltaX * scrollableWidth) / (trackWidth - thumbWidth)),
      scrollableWidth
    );

    contentRef.current.scrollLeft = newScrollLeft;
  };

  // Завершение перетаскивания
  const endDrag = () => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    updateScrollbar();
    window.addEventListener('resize', updateScrollbar);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', endDrag);
    }

    return () => {
      window.removeEventListener('resize', updateScrollbar);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', endDrag);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, thumbWidth]);


  return (
    <Box
      sx={{
        position : 'relative',
        minWidth : '300px',
        height   : '100%',
        mr       : editMode ? '470px' : 0,
        mt       : 3,
        pb       : 5, /* Место для скроллбара */
      }}

      onClick = {onClick}
    >
      <Box
        ref={contentRef}
        onScroll={handleScroll}
        sx={{
          height          : '100%',
          overflowY       : 'auto',
          overflowX       : 'auto',
          scrollbarWidth  : 'none', /* Для Firefox */
          MsOverflowStyle : 'none', /* Для IE */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {
          children
        }
        <Box
          sx={{
            position   : 'fixed',
            bottom     : 0,
            left       : 0,
            right      : 0,
            height     : '20px',
            background : 'rgba(0,0,0,0.2)',
            zIndex     : 100,
          }}
        >
          <Box
            ref        = {scrollThumbRef}
            sx         = {{
              position     : 'absolute',
              left         : `${leftOffsetScrollButton + 16}px`,
              height       : '100%',
              background   : 'rgba(0, 0, 0, 0.3)',
              borderRadius : '4px',
              cursor       : 'grab',
              transition   : 'background 0.2s',
              '&:hover, &:active': {
                background: 'rgba(0, 0, 0, 0.5)',
              },
              '&:active': {
                cursor: 'grabbing',
              },
            }}
            style       = {{
              width     : `${thumbWidth}px`,
              transform : `translateX(${thumbPosition}px)`
            }}
            onMouseDown = {startDrag}
          />
        </Box>
      </Box>
    </Box>
  )
};
