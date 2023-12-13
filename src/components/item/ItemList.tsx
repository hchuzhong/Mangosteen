import { defineComponent, PropType, ref } from 'vue';
import s from './ItemList.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { Icon } from '../../shared/Icon';
import { Tab, Tabs } from '../../shared/Tabs';

export const ItemList = defineComponent({
    setup: (props, context) => {
        const refSelected = ref('本月')
        return () => (
            <MainLayout>{{
                title: () => '山竹记账',
                icon: () => <Icon name='menu' />,
                default: () => (
                    <Tabs classPrefix={'customTabs'} v-model:selected={refSelected.value}>
                        <Tab name='本月'>
                            list1
                        </Tab>
                        <Tab name='上月'>
                            list2
                        </Tab>
                        <Tab name='今年'>
                            list3
                        </Tab>
                        <Tab name='自定义起始时间'>
                            list4
                        </Tab>
                    </Tabs>
                )
            }}</MainLayout>
        )
    }
})