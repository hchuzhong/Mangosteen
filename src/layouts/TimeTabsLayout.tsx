import { PropType, defineComponent, reactive, ref } from 'vue';
import s from './TimeTabsLayout.module.scss';
import { MainLayout } from './MainLayout';
import { Form, FormItem } from '../shared/Form';
import { OverlayIcon } from '../shared/Overlay';
import { Time, TimeConst, TimeFunc } from '../shared/time';
import { Tab, Tabs } from '../shared/Tabs';
import { Overlay, Toast } from 'vant';
import { RouterLink } from 'vue-router';
import { FloatButton } from '../shared/FloatButton';

const propsComponent = defineComponent({
    props: {
        startDate: String,
        endDate: String
    }
})

export const TimeTabsLayout = defineComponent({
    props: {
        component: {
            type: Object as PropType<typeof propsComponent>,
            required: true
        },
        reRenderOnSelect: {
            type: Boolean as PropType<boolean>,
            default: false
        },
        hideThisYear: {
            type: Boolean as PropType<boolean>,
            deafult: false
        }
    },
    setup: (props, context) => {
        const refSelected = ref('curMonth')
        const customTime = reactive<{start?: string, end?: string}>({})
        const time = new Time()
        const tempTime = reactive<{start?: string, end?: string}>({
            start: new Time().format(),
            end: new Time().format(),
        })
        const timeList = [
            { start: time.firstDayOfMonth(), end: time.lastDayOfMonth() },
            { start: time.add(-1, 'month').firstDayOfMonth(), end: time.add(-1, 'month').lastDayOfMonth() },
            { start: time.firstDayOfYear(), end: time.lastDayOfYear() },
        ]
        const onUpdateSelectedTab = () => {
            if (refSelected.value === 'customTime') {
                refOverlayVisible.value = true
            }
        }
        const refOverlayVisible = ref(false)
        const onSubmitCustomTime = (e: Event) => {
            e.preventDefault()
            if (refSelected.value === 'customTime' && props.hideThisYear) {
                const diffTime = TimeFunc.wrapDateDiff(tempTime.start!, tempTime.end!)
                if (diffTime <= 0) return Toast('开始时间不能大于结束时间')
                const moreThan60Days = diffTime >= 60 * TimeConst.DAY_MILLISECOND
                if (moreThan60Days) return Toast('时间跨度不能超过 60 天')
            }
            refOverlayVisible.value = false
            Object.assign(customTime, tempTime)
        }
        return () => (
            <MainLayout>{{
                title: () => '山竹记账',
                icon: () => <OverlayIcon />,
                default: () => <>
                    {props.hideThisYear ?
                        <Tabs classPrefix='customTabs' v-model:selected={refSelected.value} onUpdate:selected={onUpdateSelectedTab} reRenderOnSelect={props.reRenderOnSelect}>
                            <Tab name='本月' value="curMonth">
                                <props.component startDate={timeList[0].start.format()} endDate={timeList[0].end.format()} />
                            </Tab>
                            <Tab name='上月' value="lastMonth">
                                <props.component startDate={timeList[1].start.format()} endDate={timeList[1].end.format()} />
                            </Tab>
                            <Tab name='自定义时间' value="customTime">
                                <props.component startDate={customTime.start} endDate={customTime.end} />
                            </Tab>
                        </Tabs> :
                        <Tabs classPrefix='customTabs' v-model:selected={refSelected.value} onUpdate:selected={onUpdateSelectedTab} reRenderOnSelect={props.reRenderOnSelect}>
                            <Tab name='本月' value="curMonth">
                                <props.component startDate={timeList[0].start.format()} endDate={timeList[0].end.format()} />
                            </Tab>
                            <Tab name='上月' value="lastMonth">
                                <props.component startDate={timeList[1].start.format()} endDate={timeList[1].end.format()} />
                            </Tab>
                            <Tab name='今年' value="curYear">
                                <props.component startDate={timeList[2].start.format()} endDate={timeList[2].end.format()} />
                            </Tab>
                            <Tab name='自定义时间' value="customTime">
                                <props.component startDate={customTime.start} endDate={customTime.end} />
                            </Tab>
                        </Tabs>
                    }
                    <RouterLink to='/items/create'>
                        <FloatButton iconName="add" />
                    </RouterLink>
                    <Overlay z-index={64} show={refOverlayVisible.value} class={s.overlay}>
                        <div class={s.overlay_inner}>
                            <header>请选择时间</header>
                            <main>
                                <Form onSubmit={onSubmitCustomTime}>
                                    <FormItem type='date' label='开始时间' v-model={tempTime.start} />
                                    <FormItem type='date' label='结束时间' v-model={tempTime.end} />
                                    <FormItem class={s.actions}>
                                        <div class={s.actions}>
                                            <button type='button' onClick={() => refOverlayVisible.value = false}>取消</button>
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