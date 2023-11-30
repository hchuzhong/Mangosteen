import { defineComponent, ref } from 'vue';
import s from './Welcome.module.scss';
import { useRouter } from 'vue-router';

export const Welcome = defineComponent({
  setup: (props, context) => {
    const router = useRouter()
    const refCurStep = ref(0)
    const stepConfig = [
      {icon: 'pig', text1: '会挣钱', text2: '还要会省钱'},
      {icon: 'clock', text1: '每日提醒', text2: '不会漏掉每一笔账单'},
      {icon: 'statistics', text1: '数据可视化', text2: '收支一目了然'},
      {icon: 'cloud', text1: '云备份', text2: '再也不怕数据丢失', lastStep: true},
    ]
    let curStepConfig = ref(stepConfig[refCurStep.value])
    const nextAction = () => {
      if (refCurStep.value === stepConfig.length - 1) return toStartPage()
      refCurStep.value += 1
      curStepConfig.value = stepConfig[refCurStep.value]
    }
    const toStartPage = () => {
      router.push('/')
    }
    
    
    return () => (
      <div class={s.wrapper}>
        <header>
            <svg><use xlinkHref="#mangosteen"/></svg>
            <h1>山竹记账</h1>
        </header>
        <main>
          <div class={s.card}>
            <svg><use xlinkHref={'#' + curStepConfig.value.icon}/></svg>
            <h2>{curStepConfig.value.text1}<br/>{curStepConfig.value.text2}</h2>
          </div>
        </main>
        <footer class={s.actions}>
          <button class={s.fake}>跳过</button>
          <button onClick={nextAction}>{curStepConfig.value.lastStep ? '完成' : '下一页'}</button>
          <button onClick={toStartPage}>跳过</button>
        </footer>
    </div>
    )
  }
})