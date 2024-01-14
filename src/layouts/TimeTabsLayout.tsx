import { PropType, defineComponent, onUnmounted, reactive, ref } from 'vue';
import s from './TimeTabsLayout.module.scss';
import { MainLayout } from './MainLayout';
import { Form, FormItem } from '../shared/Form';
import { OverlayIcon } from '../shared/Overlay';
import { Time, TimeConst, TimeFunc } from '../shared/time';
import { Tab, Tabs } from '../shared/Tabs';
import { Overlay, Toast } from 'vant';
import { RouterLink } from 'vue-router';
import { FloatButton } from '../shared/FloatButton';
import { GlobalConst } from '../shared/globalConst';
import { usePreferenceStore } from '../stores/usePreferenceStore';

const propsComponent = defineComponent({
    props: {
        startDate: String,
        endDate: String
    }
})

export const TimeTabsLayout = defineComponent({
    props: {
        tabType: {
            type: String as PropType<'items' | 'statistics'>,
            required: true
        },
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
        const preferenceStore = usePreferenceStore()
        const refSelected = ref<keyof TimeType>(preferenceStore[`${props.tabType}Tab`])
        const customTime = reactive<CustomTimeType>(preferenceStore[`${props.tabType}CustomTime`])
        const time = new Time()
        const tempTime = reactive<CustomTimeType>({
            startDate: customTime.startDate ? customTime.startDate : new Time().format(),
            endDate: customTime.endDate ? customTime.endDate : new Time().format(),
        })
        const timeList = [
            { start: time.firstDayOfMonth(), end: time.lastDayOfMonth() },
            { start: time.add(-1, 'month').firstDayOfMonth(), end: time.add(-1, 'month').lastDayOfMonth() },
            { start: time.firstDayOfYear(), end: time.lastDayOfYear() },
        ]
        const onUpdateSelectedTab = () => {
            if (refSelected.value === GlobalConst.customTime) {
                refOverlayVisible.value = true
            }
        }
        const refOverlayVisible = ref(false)
        const onSubmitCustomTime = (e: Event) => {
            e.preventDefault()
            if (refSelected.value === GlobalConst.customTime) {
                const diffTime = TimeFunc.wrapDateDiff(tempTime.startDate!, tempTime.endDate!)
                if (diffTime <= 0) return Toast('The start time cannot be\n greater than the end time')
                const moreThan60Days = diffTime >= 60 * TimeConst.DAY_MILLISECOND
                if (moreThan60Days && props.hideThisYear) return Toast('The time span cannot\n exceed 60 days')
            }
            refOverlayVisible.value = false
            Object.assign(customTime, tempTime)
        }
        onUnmounted(() => {
            preferenceStore[`${props.tabType}Tab`] = refSelected.value
            customTime.startDate && customTime.endDate && (preferenceStore[`${props.tabType}CustomTime`] = customTime)
        })
        return () => (
            <MainLayout>{{
                title: () => 'Mangosteen Bookkeeping',
                icon: () => <OverlayIcon />,
                default: () => <>
                    {props.hideThisYear ?
                        <Tabs classPrefix='customTabs' v-model:selected={refSelected.value} onUpdate:selected={onUpdateSelectedTab} reRenderOnSelect={props.reRenderOnSelect}>
                            <Tab name='This Month' value={GlobalConst.curMonth}>
                                <props.component startDate={timeList[0].start.format()} endDate={timeList[0].end.format()} />
                            </Tab>
                            <Tab name='Last Month' value={GlobalConst.lastMonth}>
                                <props.component startDate={timeList[1].start.format()} endDate={timeList[1].end.format()} />
                            </Tab>
                            <Tab name='Custom Time' value={GlobalConst.customTime}>
                                <props.component startDate={customTime.startDate} endDate={customTime.endDate} />
                            </Tab>
                        </Tabs> :
                        <Tabs classPrefix='customTabs' v-model:selected={refSelected.value} onUpdate:selected={onUpdateSelectedTab} reRenderOnSelect={props.reRenderOnSelect}>
                            <Tab name='This Month' value={GlobalConst.curMonth}>
                                <props.component startDate={timeList[0].start.format()} endDate={timeList[0].end.format()} />
                            </Tab>
                            <Tab name='Last Month' value={GlobalConst.lastMonth}>
                                <props.component startDate={timeList[1].start.format()} endDate={timeList[1].end.format()} />
                            </Tab>
                            <Tab name='This Year' value={GlobalConst.curYear}>
                                <props.component startDate={timeList[2].start.format()} endDate={timeList[2].end.format()} />
                            </Tab>
                            <Tab name='Custom Time' value={GlobalConst.customTime}>
                                <props.component startDate={customTime.startDate} endDate={customTime.endDate} />
                            </Tab>
                        </Tabs>
                    }
                    <RouterLink to='/items/create'>
                        <FloatButton iconName="add" />
                    </RouterLink>
                    <Overlay z-index={64} show={refOverlayVisible.value} class={s.overlay}>
                        <div class={s.overlay_inner}>
                            <header>Please Choose Time</header>
                            <main>
                                <Form onSubmit={onSubmitCustomTime}>
                                    <FormItem type='date' label='Start Date' v-model={tempTime.startDate} />
                                    <FormItem type='date' label='end Date' v-model={tempTime.endDate} />
                                    <FormItem class={s.actions}>
                                        <div class={s.actions}>
                                            <button type='button' onClick={() => refOverlayVisible.value = false}>Cancel</button>
                                            <button type='submit'>Confirm</button>
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