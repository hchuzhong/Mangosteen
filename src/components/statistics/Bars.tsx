import { defineComponent, PropType, reactive, computed } from 'vue';
import s from './Bars.module.scss';

export const Bars = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const data3 = reactive([
            { tag: { id: 1, name: '房租', sign: 'x' }, amount: 3000 },
            { tag: { id: 2, name: 'haha', sign: 'A' }, amount: 800 },
            { tag: { id: 3, name: 'xixi', sign: 'G' }, amount: 10 },
        ])
        const betterData3 = computed(() => {
            const total = data3.reduce((sum, item) => sum + item.amount, 0)
            return data3.map(item => ({
                ...item,
                percent: Math.round(item.amount / total * 100) + '%'
            }))
        })
        return () => (
            <div class={s.wrapper}>
                {betterData3.value.map(({ tag, amount, percent }) => {
                    return (
                        <div class={s.topItem}>
                            <div class={s.sign}>
                                {tag.sign}
                            </div>
                            <div class={s.bar_wrapper}>
                                <div class={s.bar_text}>
                                    <span> {tag.name} - {percent} </span>
                                    <span> ￥{amount} </span>
                                </div>
                                <div class={s.bar}>
                                    <div class={s.bar_inner}></div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
})