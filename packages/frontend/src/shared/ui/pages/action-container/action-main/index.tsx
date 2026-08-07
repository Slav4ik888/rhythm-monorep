import { FC, memo } from 'react';
import { ActionMainComponent } from './component';
import { LayoutInnerPageType } from '../../layouts/layout-inner-page';
import { Errors } from 'shared/lib/validators';



interface Props {
  loading   : boolean
  errors    : Errors
  type      : LayoutInnerPageType
  textBtn?  : string
  disabled? : boolean
  onSubmit  : () => void
}

/** Кнопка "Зарегистрироваться" | "Войти" */
export const ActionMain: FC<Props> = memo(({
  type, textBtn: label, loading, errors, disabled = false, onSubmit
}) => (
  <ActionMainComponent
    textBtn  = {label || (type === 'login' ? 'Войти' : 'Регистрация')}
    errors   = {errors}
    loading  = {loading}
    disabled = {disabled}
    onSubmit = {onSubmit}
  />
));
