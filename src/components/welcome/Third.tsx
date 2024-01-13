import { Icon } from '../../shared/Icon';
import s from './welcome.module.scss';
export const Third = () => {
  return (
    <div class={s.card} >
      <Icon name="chart" class={s.icon} />
      <h2>Data Visualisation<br />Clear Overview Of Finances</h2>
    </div>
  )
}

Third.displayName = 'Third'