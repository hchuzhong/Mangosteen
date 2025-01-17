import { createApp } from 'vue'
import { App } from './App'
import { createRouter } from 'vue-router'
import { routes } from './config/routes'
import { history } from './shared/history'
import '@svgstore'
import { createPinia } from 'pinia'
import { useMeStore } from './stores/useMeStore'
import { Locale } from 'vant';
import enUS from 'vant/es/locale/lang/en-US';

Locale.use('en-US', enUS);

const pinia = createPinia()
const router = createRouter({ history, routes })

createApp(App).use(pinia).use(router).mount('#app')

const meStore = useMeStore()
meStore.fetchMe()
const whiteList: Record<string, 'exact' | 'startsWith'> = {
    '/': 'exact',
    '/items': 'exact',
    '/welcome': 'startsWith',
    '/sign_in': 'startsWith',
}
router.beforeEach((to, from) => {
    for (const key in whiteList) {
        const value = whiteList[key]
        if (value === 'exact' && to.path === key) {
            return true
        }
        if (value === 'startsWith' && to.path.startsWith(key)) {
            return true
        }
    }
    return meStore.mePromise!.then(
        () => true,
        () =>  '/sign_in?return_to=' + from.path
    )
})
