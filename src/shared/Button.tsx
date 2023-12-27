import { PropType, defineComponent, ref, computed } from 'vue';
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
        },
        autoSelfDisabled: {
            type: Boolean,
            default: false
        }
    },
    setup: (props, context) => {
        const selfDisabled = ref(false)
        const _disabled = computed(() => {
            if (!props.autoSelfDisabled) return props.disabled
            if (selfDisabled.value) return true
            return props.disabled
        })
        const onClick = (e: MouseEvent) => {
            props.onClick?.(e)
            selfDisabled.value = true
            setTimeout(() => {
                selfDisabled.value = false
            }, 500);
        }
        return () => (
            <button type={props.type} disabled={_disabled.value} class={[s.button, s[props.level]]} onClick={onClick}>
                {context.slots.default?.()}
            </button>
        )
    }
})