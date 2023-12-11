import { defineComponent, PropType, ref } from 'vue';
import s from './ItemCreate.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { Icon } from '../../shared/Icon';
import { Tab, Tabs } from '../../shared/Tabs';
import { InputPad } from './InputPad';

export const ItemCreate = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const refKind = ref('支出')
        return () => (
            <MainLayout>{
                {
                    title: () => '记一笔',
                    icon: () => <Icon name='left' />,
                    default: () => <>
                        <Tabs v-model:selected={refKind.value}>
                            <Tab name='支出'>
                                icon list
                            </Tab>
                            <Tab name='收入'>
                                icon list1
                            </Tab>
                        </Tabs>
                        <div class={s.inputPad_wrapper}>
                            <InputPad />
                        </div>
                    </>
                }
            }</MainLayout>
        )
    }
})