import { PropType, defineComponent } from 'vue';
import { Icon, IconNames } from './Icon';
import s from './FloatButton.module.scss';

export const FloatButton = defineComponent({
    props: {
        iconName: {
            type: String as PropType<IconNames>,
            required: true
        }
    },
    setup: (props, context) => {
        return () => (
            <div class={s.floatButton}>
                <Icon name="add" class={s.icon} />
            </div>
        )
    }
})