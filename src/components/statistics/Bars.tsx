import { defineComponent, PropType } from 'vue';
import s from './Bars.module.scss';
import { Money } from '../../shared/Money';
import { noKindText, noKindEmoji } from '../../shared/globalConst';

export const Bars = defineComponent({
    props: {
        data: {
            type: Array as PropType<{tag: Tag, amount: number, percent: number}[]>
        }
    },
    setup: (props, context) => {
        return () => (
            <div class={s.wrapper}>
                {props.data && props.data.length > 0 ? props.data.map(({ tag, amount, percent }) => {
                    return (
                        <div class={s.topItem}>
                            <div class={s.sign}>
                                {tag && tag.sign ? tag.sign : noKindEmoji}
                            </div>
                            <div class={s.bar_wrapper}>
                                <div class={s.bar_text}>
                                    <span> {tag && tag.name ? tag.name : noKindText} - {percent}% </span>
                                    <span> ￥<Money value={amount} /> </span>
                                </div>
                                <div class={s.bar}>
                                    <div class={s.bar_inner} style={{width: `${percent}%`}}></div>
                                </div>
                            </div>
                        </div>
                    )
                }) : <div>No more data</div> }
            </div>
        )
    }
})