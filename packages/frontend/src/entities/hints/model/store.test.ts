// packages/frontend/src/entities/hints/model/store.test.ts

import { useHintsStore } from './store';

describe('useHintsStore', () => {
  beforeEach(() => {
    useHintsStore.setState({
      loading: false,
      errors: {},
      hintsQueue: [],
      shownHints: [],
      currentHintId: null,
    });
  });

  describe('initialState', () => {
    it('должен вернуть начальное состояние', () => {
      const state = useHintsStore.getState();
      expect(state.loading).toBe(false);
      expect(state.errors).toEqual({});
      expect(state.hintsQueue).toEqual([]);
      expect(state.shownHints).toEqual([]);
      expect(state.currentHintId).toBeNull();
    });
  });

  describe('setErrors', () => {
    it('должен установить ошибки', () => {
      const errors = { general: 'Ошибка' };
      useHintsStore.getState().setErrors(errors);
      expect(useHintsStore.getState().errors).toEqual(errors);
    });
  });

  describe('clearErrors', () => {
    it('должен очистить ошибки', () => {
      useHintsStore.getState().setErrors({ general: 'test' });
      useHintsStore.getState().clearErrors();
      expect(useHintsStore.getState().errors).toEqual({});
    });
  });

  describe('shownNextHint', () => {
    it('должен показать следующую подсказку из очереди', () => {
      useHintsStore.setState({ hintsQueue: ['hint1', 'hint2'], currentHintId: null });
      useHintsStore.getState().shownNextHint();
      const state = useHintsStore.getState();
      expect(state.currentHintId).toBe('hint1');
      expect(state.hintsQueue).toEqual(['hint2']);
    });

    it('должен установить currentHintId=null если очередь пуста', () => {
      useHintsStore.setState({ hintsQueue: [], currentHintId: 'hint1' });
      useHintsStore.getState().shownNextHint();
      const state = useHintsStore.getState();
      expect(state.currentHintId).toBeNull();
      expect(state.hintsQueue).toEqual([]);
    });
  });

  describe('closeCurrentHint', () => {
    it('должен переместить текущую подсказку в shownHints и показать следующую', () => {
      useHintsStore.setState({
        currentHintId: 'hint1',
        hintsQueue: ['hint2', 'hint3'],
        shownHints: [],
      });
      useHintsStore.getState().closeCurrentHint();
      const state = useHintsStore.getState();
      expect(state.shownHints).toEqual(['hint1']);
      expect(state.currentHintId).toBe('hint2');
      expect(state.hintsQueue).toEqual(['hint3']);
    });

    it('должен корректно работать без currentHintId', () => {
      useHintsStore.setState({
        currentHintId: null,
        hintsQueue: ['hint1'],
        shownHints: [],
      });
      useHintsStore.getState().closeCurrentHint();
      const state = useHintsStore.getState();
      expect(state.shownHints).toEqual([]);
      expect(state.currentHintId).toBe('hint1');
      expect(state.hintsQueue).toEqual([]);
    });
  });

  describe('addHintsToQueue', () => {
    it('должен добавить подсказки в очередь и показать первую если currentHintId=null', () => {
      useHintsStore.setState({ hintsQueue: [], shownHints: [], currentHintId: null });
      useHintsStore.getState().addHintsToQueue(['hint1', 'hint2']);
      const state = useHintsStore.getState();
      expect(state.currentHintId).toBe('hint1');
      expect(state.hintsQueue).toEqual(['hint2']);
    });

    it('должен добавить подсказки в очередь без изменения currentHintId если он уже активен', () => {
      useHintsStore.setState({ hintsQueue: [], shownHints: [], currentHintId: 'active' });
      useHintsStore.getState().addHintsToQueue(['hint1', 'hint2']);
      const state = useHintsStore.getState();
      expect(state.currentHintId).toBe('active');
      expect(state.hintsQueue).toEqual(['hint1', 'hint2']);
    });

    it('не должен добавлять уже показанные подсказки', () => {
      useHintsStore.setState({ hintsQueue: [], shownHints: ['hint1'], currentHintId: null });
      useHintsStore.getState().addHintsToQueue(['hint1', 'hint2']);
      const state = useHintsStore.getState();
      expect(state.currentHintId).toBe('hint2');
      expect(state.hintsQueue).toEqual([]);
    });

    it('не должен добавлять текущую активную подсказку', () => {
      useHintsStore.setState({ hintsQueue: [], shownHints: [], currentHintId: 'hint1' });
      useHintsStore.getState().addHintsToQueue(['hint1', 'hint2']);
      const state = useHintsStore.getState();
      expect(state.currentHintId).toBe('hint1');
      expect(state.hintsQueue).toEqual(['hint2']);
    });

    it('не должен добавлять дубликаты уже существующих в очереди', () => {
      useHintsStore.setState({ hintsQueue: ['hint1'], shownHints: [], currentHintId: 'active' });
      useHintsStore.getState().addHintsToQueue(['hint1', 'hint2']);
      const state = useHintsStore.getState();
      expect(state.hintsQueue).toEqual(['hint1', 'hint2']);
    });
  });

  describe('startLoading', () => {
    it('должен установить loading=true и очистить errors', () => {
      useHintsStore.getState().setErrors({ old: 'error' });
      useHintsStore.getState().startLoading();
      const state = useHintsStore.getState();
      expect(state.loading).toBe(true);
      expect(state.errors).toEqual({});
    });
  });

  describe('finishDontShowAgain', () => {
    it('должен добавить текущую подсказку в shownHints, показать следующую', () => {
      useHintsStore.setState({
        currentHintId: 'hint1',
        hintsQueue: ['hint2'],
        shownHints: [],
        loading: true,
      });
      useHintsStore.getState().finishDontShowAgain('hint1');
      const state = useHintsStore.getState();
      expect(state.shownHints).toEqual(['hint1']);
      expect(state.currentHintId).toBe('hint2');
      expect(state.hintsQueue).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.errors).toEqual({});
    });

    it('должен использовать переданный lastCurrentHintId', () => {
      useHintsStore.setState({
        currentHintId: null, // мог измениться за время запроса
        hintsQueue: ['hint2'],
        shownHints: [],
        loading: true,
      });
      useHintsStore.getState().finishDontShowAgain('hint1');
      const state = useHintsStore.getState();
      expect(state.shownHints).toEqual(['hint1']);
      expect(state.currentHintId).toBe('hint2');
    });
  });

  describe('failDontShowAgain', () => {
    it('должен установить ошибки и сбросить loading', () => {
      useHintsStore.setState({ loading: true });
      useHintsStore.getState().failDontShowAgain({ general: 'Ошибка сети' });
      const state = useHintsStore.getState();
      expect(state.errors).toEqual({ general: 'Ошибка сети' });
      expect(state.loading).toBe(false);
    });
  });
});
