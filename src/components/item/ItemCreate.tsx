import { defineComponent, PropType, ref, reactive } from 'vue';
import s from './ItemCreate.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { Icon } from '../../shared/Icon';
import { Tab, Tabs } from '../../shared/Tabs';
import { InputPad } from './InputPad';
import { Tags } from './Tags';
import { http } from '../../shared/Http';
import { useRouter } from 'vue-router';
import { Dialog } from 'vant';
import { AxiosError } from 'axios';

export const ItemCreate = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const formData = reactive({
            kind: 'expenses',
            tag_id: [],
            amount: 0,
            happen_at: new Date().toISOString()
        })
        const router = useRouter()
        const onError = (error: AxiosError<ResourceError>) => {
            if (error.response?.status === 422) {
                Dialog.alert({
                    title: '出错',
                    message: Object.values(error.response.data.errors).join('\n')
                }).then(() => {});
            }
            throw error
        }
        const onSubmit = async () => {
            const response = await http.post<Resource<Item>>('/items', formData, {params: {_mock: 'itemCreate'}}).catch(onError)
            router.push('/items')
        }
        return () => (
            <MainLayout class={s.layout}>{{
                title: () => '记一笔',
                icon: () => <Icon name='left' />,
                default: () => <>
                    <div class={s.wrapper}>
                        <Tabs v-model:selected={formData.kind} class={s.tabs}>
                            <Tab name="支出">
                                <Tags kind="expenses" v-model:selected={formData.tag_id[0]} />
                            </Tab>
                            <Tab name="收入">
                                <Tags kind="income" v-model:selected={formData.tag_id[0]} />
                            </Tab>
                        </Tabs>
                        <div class={s.inputPad_wrapper}>
                            <InputPad v-model:happenAt={formData.happen_at} v-model:amount={formData.amount} onSubmit={onSubmit} />
                        </div>
                    </div>
                </>
            }}</MainLayout>
        )
    }
})