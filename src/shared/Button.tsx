import { PropType, defineComponent } from 'vue';
import s from './Button.module.scss';

export const Button = defineComponent({
    props: {
        onClick: {
            type: Function as PropType<(e: MouseEvent) => void>
        },
        level: {
            type: String as PropType<'important' | 'normal' | 'danger'>,
            default: 'important'
        },
        type: {
            type: String as PropType<'button' | 'submit'>,
            default: 'button'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    setup: (props, context) => {
    return () => (
        <button type={props.type} disabled={props.disabled} class={[s.button, s[props.level]]} onClick={props.onClick}>
            {context.slots.default?.()}
        </button>
    )
    }
})