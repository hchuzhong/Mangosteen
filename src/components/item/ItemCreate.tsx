import { defineComponent, PropType, ref, reactive } from 'vue';
import s from './ItemCreate.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { Tab, Tabs } from '../../shared/Tabs';
import { InputPad } from './InputPad';
import { Tags } from './Tags';
import { http } from '../../shared/Http';
import { useRouter } from 'vue-router';
import { Dialog } from 'vant';
import { AxiosError } from 'axios';
import { BackIcon } from '../../shared/BackIcon';
import { hasError, validate } from '../../shared/validate';
import { GlobalConst } from '../../shared/globalConst';
import { usePreferenceStore } from '../../stores/usePreferenceStore';

export const ItemCreate = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const preferenceStore = usePreferenceStore()
        const formData = reactive<Partial<Item>>({
            kind: preferenceStore.statisticsKind,
            tag_ids: [],
            amount: 0,
            happened_at: new Date().toISOString()
        })
        const errors = reactive<FormErrors<typeof formData>>({kind: [], tag_ids: [], amount: [], happened_at: []
        })
        const router = useRouter()
        const onError = (error: AxiosError<ResourceError>) => {
            if (error.response?.status === 422) {
                Dialog.alert({
                    title: 'Mistake',
                    message: Object.values(error.response.data.errors).join('\n')
                }).then(() => {});
            }
            throw error
        }
        const onSubmit = async () => {
            Object.assign(errors, {kind: [], tag_ids: [], amount: [], happened_at: []})
            const validateErrors = validate(formData, [
                {key: 'kind', type: 'required', message: 'Kind is required'},
                {key: 'tag_ids', type: 'required', message: 'Tag is required'},
                {key: 'amount', type: 'required', message: 'Amount is required'},
                {key: 'amount', type: 'noEqual', value: 0, message: 'The amount cannot be 0'},
                {key: 'happened_at', type: 'required', message: 'Time must be chosen'},
            ])
            Object.assign(errors, validateErrors)
            if (hasError(errors)) {
                Dialog.alert({
                    title: 'Mistake',
                    message: Object.values(errors).filter(e => e.length).join('\n')
                }).then(() => {});
                return
            }
            await http.post< Resource<Item>>('/items', formData, {_mock: 'itemCreate', _autoLoading: true}).catch(onError)
            router.push('/items')
        }
        return () => (
            <MainLayout class={s.layout}>{{
                title: () => 'write down an account',
                icon: () => <BackIcon />,
                default: () => <>
                    <div class={s.wrapper}>
                        <Tabs v-model:selected={formData.kind} class={s.tabs}>
                            <Tab name="Expenses" value={GlobalConst.expenses}>
                                <Tags kind={GlobalConst.expenses} v-model:selected={formData.tag_ids![0]} />
                            </Tab>
                            <Tab name="Income" value={GlobalConst.income}>
                                <Tags kind={GlobalConst.income} v-model:selected={formData.tag_ids![0]} />
                            </Tab>
                        </Tabs>
                        <div class={s.inputPad_wrapper}>
                            <InputPad v-model:happenAt={formData.happened_at} v-model:amount={formData.amount} onSubmit={onSubmit} />
                        </div>
                    </div>
                </>
            }}</MainLayout>
        )
    }
})