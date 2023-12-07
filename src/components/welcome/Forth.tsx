import { Icon } from '../../shared/Icon';
import s from './welcome.module.scss';
export const Forth = () => (
  <div class={s.card}>
    <Icon name="cloud" class={s.icon} />
    <h2>每日提醒<br />不遗漏每一笔账单</h2>
  </div>
)

Forth.displayName = 'Forth'