// packages/frontend/src/entities/ui/model/store.spec.ts

import { useUIStore } from './store';
import { MessageType } from '../types/messages';

describe('useUIStore — сообщения (message)', () => {
  beforeEach(() => {
    // Сбрасываем состояние перед каждым тестом
    useUIStore.setState({
      message: {} as never,
    });
  });

  describe('setSuccessMessage', () => {
    it('должен установить message.type = SUCCESS', () => {
      useUIStore.getState().setSuccessMessage('Всё хорошо');
      const { message } = useUIStore.getState();

      expect(message.type).toBe(MessageType.SUCCESS);
      expect(message.message).toBe('Всё хорошо');
    });

    it('должен установить timeout по умолчанию', () => {
      useUIStore.getState().setSuccessMessage('Всё хорошо');
      const { message } = useUIStore.getState();

      expect(message.timeout).toBeGreaterThan(0);
    });
  });

  describe('setWarningMessage', () => {
    it('должен установить message.type = WARNING', () => {
      useUIStore.getState().setWarningMessage('Предупреждение');
      const { message } = useUIStore.getState();

      expect(message.type).toBe(MessageType.WARNING);
      expect(message.message).toBe('Предупреждение');
    });
  });

  describe('setErrorMessage', () => {
    it('должен установить message.type = ERROR', () => {
      useUIStore.getState().setErrorMessage('Ошибка');
      const { message } = useUIStore.getState();

      expect(message.type).toBe(MessageType.ERROR);
      expect(message.message).toBe('Ошибка');
    });
  });

  describe('setInfoMessage', () => {
    it('должен установить message.type = INFO', () => {
      useUIStore.getState().setInfoMessage('Информация');
      const { message } = useUIStore.getState();

      expect(message.type).toBe(MessageType.INFO);
      expect(message.message).toBe('Информация');
    });
  });

  describe('setMessage', () => {
    it('должен установить произвольный message', () => {
      const msg = {
        type: MessageType.SUCCESS,
        message: 'Произвольное',
        timeout: 5000,
      };
      useUIStore.getState().setMessage(msg);
      const { message } = useUIStore.getState();

      expect(message).toEqual(msg);
    });
  });

  describe('clearMessage', () => {
    it('должен очистить message', () => {
      useUIStore.getState().setSuccessMessage('Успех');
      // Убедимся, что message не пустой
      expect(useUIStore.getState().message.type).toBe(MessageType.SUCCESS);

      useUIStore.getState().clearMessage();
      const { message } = useUIStore.getState();

      // После очистки поле type должно отсутствовать (пустой объект)
      expect(message.type).toBeUndefined();
      expect(message.message).toBeUndefined();
    });
  });
});
