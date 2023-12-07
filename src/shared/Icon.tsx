import { PropType, defineComponent } from 'vue';
import s from './Icon.module.scss';

export type IconNames = 'add' | 'chart' | 'clock' | 'cloud' | 'mangosteen' | 'pig'

export const Icon = defineComponent({
    props: {
        name: {
            type: String as PropType<IconNames>,
            required: true
        }
    },
    setup: (props, context) => {
        return () => (
            <svg class={s.icon}>
                <use xlinkHref={'#' + props.name}></use>
            </svg>
        )
    }
})