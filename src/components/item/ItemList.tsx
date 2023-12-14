import { defineComponent, reactive, ref, watchEffect } from 'vue';
import s from './ItemList.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { Icon } from '../../shared/Icon';
import { Tab, Tabs } from '../../shared/Tabs';
import { ItemSummary } from './ItemSummary';
import { Time } from '../../shared/time';
import { Overlay } from 'vant';
import { Form, FormItem } from '../../shared/Form';

export const ItemList = defineComponent({
    setup: (props, context) => {
        const refSelected = ref('本月')
        const customTime = reactive({ start: new Time().format(), end: new Time().format() })
        const time = new Time()
        const timeList = [
            { start: time.firstDayOfMonth(), end: time.lastDayOfMonth() },
            { start: time.add(-1, 'month').firstDayOfMonth(), end: time.add(-1, 'month').lastDayOfMonth() },
            { start: time.firstDayOfYear(), end: time.lastDayOfYear() },
        ]
        const onUpdateSelectedTab = () => {
            if (refSelected.value === '自定义时间') {
                refOverlayVisible.value = true
            }
        }
        const refOverlayVisible = ref(false)
        const onSubmitCustomTime = (e: Event) => {
            e.preventDefault()
            refOverlayVisible.value = false
        }
        const onUpdateSelected = () => {}
        return () => (
            <MainLayout>{{
                title: () => '山竹记账',
                icon: () => <Icon name='menu' />,
                default: () => <>
                    <Tabs classPrefix={'customTabs'} v-model:selected={refSelected.value} onUpdate:selected={onUpdateSelectedTab}>
                        <Tab name='本月'>
                            <ItemSummary startDate={timeList[0].start.format()} endDate={timeList[0].end.format()} />
                        </Tab>
                        <Tab name='上月'>
                            <ItemSummary startDate={timeList[1].start.format()} endDate={timeList[1].end.format()} />
                        </Tab>
                        <Tab name='今年'>
                            <ItemSummary startDate={timeList[0].start.format()} endDate={timeList[0].end.format()} />
                        </Tab>
                        <Tab name='自定义时间'>
                            <ItemSummary startDate={customTime.start} endDate={customTime.end} />
                        </Tab>
                    </Tabs>
                    <Overlay show={refOverlayVisible.value} class={s.overlay}>
                        <div class={s.overlay_inner}>
                            <header>请选择时间</header>
                            <main>
                                <Form onSubmit={onSubmitCustomTime}>
                                    <FormItem type='date' label='开始时间' v-model={customTime.start} />
                                    <FormItem type='date' label='结束时间' v-model={customTime.end} />
                                    <FormItem class={s.actions}>
                                        <div class={s.actions}>
                                            {/* TODO */}
                                            <button type='button'>取消</button>
                                            <button type='submit'>确认</button>
                                        </div>
                                    </FormItem>
                                </Form>
                            </main>
                        </div>
                    </Overlay>
                </>
            }}</MainLayout>
        )
    }
})