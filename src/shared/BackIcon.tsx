import { defineComponent, PropType } from 'vue';
import { Icon } from './Icon';
import { useRouter } from 'vue-router';

export const BackIcon = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const router = useRouter()
        const onClick = () => {
            const {return_to} = router.currentRoute.value.query
            if (return_to) {
                router.push(return_to.toString())
            } else {
                router.back()
            }
        }
        return () => (
            <Icon name='left' onClick={onClick} />
        )
    }
})