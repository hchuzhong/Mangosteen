import { defineComponent, onMounted, PropType, ref } from 'vue';
import { Icon } from './Icon';
import s from './Overlay.module.scss';
import { RouterLink, useRouter } from 'vue-router';
import { Dialog } from 'vant';
import { useMeStore } from '../stores/useMeStore';

type LinkConfigType = {
    to: string,
    iconName: 'data' | 'charts' | 'export' | 'notify',
    text: string
}[]

export const Overlay = defineComponent({
    props: {
        onClose: {
            type: Function as PropType<() => void>
        }
    },
    setup: (props, context) => {
        const meStore = useMeStore()
        const router = useRouter()
        const curPath = router.currentRoute.value.fullPath
        const routePath = `/sign_in?return_to=${curPath}`
        const me = ref()
        onMounted(async () => {
            const response = await meStore.mePromise
            me.value = response?.data.resource
        })
        const onSignOut = async () => {
            await Dialog.confirm({
                title: '确认',
                message: '确认退出登录？'
            })
            localStorage.removeItem('jwt')
            window.location.reload()
        }
        const linkConfig: LinkConfigType = [
            { to: '/items', iconName: 'data', text: '记账数据' },
            { to: '/statistics', iconName: 'charts', text: '统计图表' },
            { to: '/export', iconName: 'export', text: '导出数据' },
            { to: '/notify', iconName: 'notify', text: '记账提醒' }
        ]
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
                        {linkConfig.map((item, index) => (
                            <li>
                                <RouterLink to={me.value ? item.to : curPath} class={s.action}  style={!me.value ? 'cursor: not-allowed;' : ''}>
                                    <Icon name={item.iconName} class={s.icon} />
                                    <span>{item.text}</span>
                                </RouterLink>
                            </li>
                        ))}
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
                {overlayVisible.value && <Overlay onClose={() => overlayVisible.value = false} />}
            </>
        )
    }
})