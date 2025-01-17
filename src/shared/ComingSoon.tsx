import { defineComponent, PropType } from 'vue';
import s from './ComingSoon.module.scss';
import { Center } from './Center';
import { Icon } from './Icon';
import { OverlayIcon } from './Overlay';
import { MainLayout } from '../layouts/MainLayout';

export const ComingSoon = defineComponent({
    setup: (props, context) => {
        return () => (
            <MainLayout>{{
                title: () => 'Mangosteen Bookkeeping',
                icon: () => <OverlayIcon />,
                default: () => (
                    <div>
                        <Center class={s.pig_wrapper}>
                            <Icon name="pig" class={s.pig} />
                        </Center>
                        <p class={s.text}>Coming Soon</p>
                    </div>
                )
            }}</MainLayout>
        )
    }
})

export default ComingSoon