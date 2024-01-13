import { Icon } from '../../shared/Icon';
import s from './welcome.module.scss';
import { FunctionalComponent } from 'vue';

export const Second: FunctionalComponent = () => {
  return <div class={s.card}>
    <Icon name="clock" class={s.icon} />
    <h2>Daily Reminders<br />Never Miss A Single Bill</h2>
  </div>
}

Second.displayName = 'Second'