import { FC, memo, useState, useEffect, useRef, useCallback } from 'react'
import Box from '@mui/material/Box';
import { Hint, Position, DEFAULT_POSITION } from 'entities/hints';
import { Button } from 'shared/ui/buttons';
import { getArrowStyle, useStyles } from './styles';
import { calculateOptimalPosition } from './utils';
import { useUI } from 'entities/ui';
import { Divider } from 'shared/ui/mui-components';
import { useTheme } from 'app/providers/theme';



interface Props {
  hint            : Hint
  leftHints       : number // Осталось подсказок
  onCloseHint     : () => void
  onDontShowAgain : () => void
}


export const HintContainer: FC<Props> = memo(({ hint, leftHints, onDontShowAgain, onCloseHint }) => {
  const { isMobile } = useUI();
  const sx = useStyles(useTheme(), isMobile);
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION);
  const hintRef = useRef<HTMLDivElement>(null);
  const targetElement = document.getElementById(hint.id);

  // Функция обновления позиции
  const updatePosition = useCallback(() => {
    if (targetElement && hintRef.current) {
      const newPosition = calculateOptimalPosition(
        hint.id,
        targetElement,
        hintRef.current,
        isMobile
      );
      setPosition(newPosition);
    }
  },
    [targetElement, isMobile, hint.id]
  );


  // Слушаем события скролла, ресайза и изменение положения элемента targetElement
  useEffect(() => {
    if (! targetElement) return;

    // Обновляем позицию сразу
    updatePosition();

    // 1. Отслеживаем изменения размера самого элемента
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(targetElement);

    // 2. Отслеживаем изменения в DOM, которые могут повлиять на позицию
    const mutationObserver = new MutationObserver((mutations) => {
      // Проверяем, были ли изменения в атрибутах стиля, классе или структуре DOM
      const relevantMutation = mutations.some(mutation =>
        mutation.type === 'attributes'
        && (mutation.attributeName === 'style' || mutation.attributeName === 'class')
      );

      if (relevantMutation) {
        updatePosition();
      }
    });

    // Наблюдаем за изменениями во всем документе
    mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true
    });

    // 3. Отслеживаем изменения layout'а (позиции) элемента
    const updateOnLayoutChange = () => {
      requestAnimationFrame(updatePosition);
    };

    // События, которые могут изменить layout
    window.addEventListener('scroll', updateOnLayoutChange, true);
    window.addEventListener('resize', updateOnLayoutChange);

    // Специально для случаев скрытия/показа сайдбаров и т.д.
    window.addEventListener('transitionend', updateOnLayoutChange);
    window.addEventListener('animationend', updateOnLayoutChange);

    // 4. Периодическая проверка (fallback)
    // const intervalId = setInterval(updatePosition, 1000); // Проверка каждую секунду

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      // clearInterval(intervalId);
      window.removeEventListener('scroll', updateOnLayoutChange, true);
      window.removeEventListener('resize', updateOnLayoutChange);
      window.removeEventListener('transitionend', updateOnLayoutChange);
      window.removeEventListener('animationend', updateOnLayoutChange);
    };
  },
    [targetElement, updatePosition]
  );


  if (! targetElement) return null;


  return (
    <Box sx={sx.overlay}>
      <Box
        ref={hintRef}
        style={{
          top  : `${position.top}px`,
          left : `${position.left}px`,
        }}
        sx={{
          ...sx.container,
          ...(position.arrowPosition === 'none' ? sx.noArrow : {})
        }}
      >
        {/* Стрелка-указатель (скрываем, если элемент не виден) */}
        {
          position.arrowPosition !== 'none' && (
            <Box
              sx={{ ...sx.arrow, ...sx[`arrow__${position.arrowPosition}`] }}
              style={getArrowStyle(position.arrowPosition, position.arrowOffset)}
            />
          )
        }
        <Box sx={sx.content}>
          {/* Контент подсказки */}
          <Box sx={sx.title}>
            {hint.title}
          </Box>

          <Divider />

          <Box sx={sx.text}>
            {hint.text}
          </Box>
          {
            hint.attention && <Box sx={sx.attention}>
              {hint.attention}
            </Box>
          }
          {/* Прогресс (опционально) */}
          {/* {leftHints && <Box sx={sx.leftHints}>{`Осталось: ${leftHints}`}</Box>} */}

          {/* Кнопки действий */}
          <Box sx={sx.actions}>
            <Button
              text    = 'Больше не показывать'
              variant = 'text'
              sx      = {sx.btnDontShow}
              onClick = {onDontShowAgain}
            />
            <Button
              text    = 'Понятно'
              onClick = {onCloseHint}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
})
