import { Icon } from '../../shared/Icon';
import s from './welcome.module.scss';
import { FunctionalComponent } from 'vue';
export const First: FunctionalComponent = () => {
  return (
    <div class={s.card}>
      <Icon name="pig" class={s.icon} />
      <h2>会挣钱<br />还会省钱</h2>
    </div>
  )
}

First.displayName = 'First'