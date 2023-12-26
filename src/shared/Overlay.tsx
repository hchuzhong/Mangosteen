import { defineComponent, onMounted, PropType, ref } from 'vue';
import { Icon } from './Icon';
import s from './Overlay.module.scss';
import { RouterLink, useRouter } from 'vue-router';
import { mePromise } from './me';
import { Dialog } from 'vant';

export const Overlay = defineComponent({
    props: {
        onClose: {
            type: Function as PropType<() => void>
        }
    },
    setup: (props, context) => {
        const router = useRouter()
        const routePath = `/sign_in?return_to=${router.currentRoute.value.fullPath}`
        const me = ref()
        onMounted(async () => {
            const response = await mePromise
            me.value = response?.data.resource
        })
        const onSignOut = async () => {
            await Dialog.confirm({
                title: '确认',
                message: '确认退出登录？'
            })
            localStorage.removeItem('jwt')
            router.push(routePath)
        }
        return () => <>
            <div class={s.mask} onClick={props.onClose}></div>
            <div class={s.overlay}>
                <section class={s.currentUser}>
                    {me.value ? 
                        <div>
                            <h2 class={s.email}>{me.value.email}</h2>
                            <p onClick={onSignOut}>点击这里退出登录</p>
                        </div> :
                        <RouterLink to={routePath} class={s.avatar}>
                            <h2>未登录用户</h2>
                            <p>点击这里登录</p>
                        </RouterLink>
                    }
                </section>
                <nav>
                    <ul class={s.action_list}>
                        <li>
                            <RouterLink to='/statistics' class={s.action}>
                                <Icon name='charts' class={s.icon} />
                                <span>统计图表</span>
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to='/export' class={s.action}>
                                <Icon name='export' class={s.icon} />
                                <span>导出数据</span>
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink to='/notify' class={s.action}>
                                <Icon name='notify' class={s.icon} />
                                <span>记账提醒</span>
                            </RouterLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    }
})


export const OverlayIcon = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const overlayVisible = ref(false)
        const onClickMenu = () => {
            overlayVisible.value = !overlayVisible.value
        }
        return () => (
            <>
                <Icon name='menu' class={s.icon} onClick={onClickMenu} />
                {overlayVisible.value && <Overlay z-index={64} onClose={() => overlayVisible.value = false} />}
            </>
        )
    }
})