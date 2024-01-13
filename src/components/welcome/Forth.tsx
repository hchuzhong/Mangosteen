import { Icon } from '../../shared/Icon';
import s from './welcome.module.scss';
export const Forth = () => (
  <div class={s.card}>
    <Icon name="cloud" class={s.icon} />
    <h2>Cloud Backup<br />No More Fear Of Data Loss</h2>
  </div>
)

Forth.displayName = 'Forth'