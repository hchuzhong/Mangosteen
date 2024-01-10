import { computed, defineComponent, ref, onMounted, watch } from 'vue';
import s from './Charts.module.scss';
import { FormItem } from '../../shared/Form';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { Bars } from './Bars';
import { http } from '../../shared/Http';
import { Time } from '../../shared/time';
import { noKindText, GlobalConst } from '../../shared/globalConst';
import { usePreferenceStore } from '../../stores/usePreferenceStore';
import { onUnmounted } from 'vue';

type DataItem = {happened_at: string, amount: number}
type Data = DataItem[]
type DataItem2 = {tag_id: string, amount: number, tag: Tag}
type Data2 = DataItem2[]

const DAY = 24 * 60 * 60 * 1000

export const Charts = defineComponent({
    props: {
        startDate: String,
        endDate: String
    },
    setup: (props, context) => {
        const preferenceStore = usePreferenceStore()
        const kind = ref(preferenceStore.statisticsKind)
        const beijingZone = 'T00:00:00.000+0800'
        const data1 = ref<Data>([])
        const betterData1 = computed<[string, number][]>(() => {
            if (!props.startDate || !props.endDate) return []
            const dataObj: Record<string, number> = {}
            data1.value.forEach(item => (dataObj[new Time(item.happened_at + beijingZone).getTimeStamp()] = item.amount))
            const diff = new Date(props.endDate).getTime() - new Date(props.startDate).getTime()
            const days = diff / DAY + 1
            return Array.from({length: days}).map((_, i) => {
                const time = new Time(props.startDate + beijingZone).add(i, 'day').getTimeStamp()
                return [new Date(time).toISOString(), dataObj[time] || 0 ]
            }) as [string, number][]
        })
        const fetchItems1 = async () => {
            if (!props.startDate || !props.endDate) return
            const response = await http.get<{groups: Data, summary: number}>('/items/summary', {
                happened_after: props.startDate,
                happened_before: props.endDate,
                kind: kind.value,
                group_by: 'happened_at'
            }, {_mock: 'itemSummary', _autoLoading: true})
            data1.value = response.data.groups
        }
        onMounted(fetchItems1)

        const data2 = ref<Data2>([])
        const betterData2 = computed<{name: string, value: number}[]>(() => {
            return data2.value.map(item => ({name: item?.tag?.name ?? noKindText, value: item.amount}))
        })
        const fetchItems2 = async () => {
            if (!props.startDate || !props.endDate) return
            const response = await http.get<{groups: Data2, summary: number}>('/items/summary', {
                happened_after: props.startDate,
                happened_before: props.endDate,
                kind: kind.value,
                group_by: 'tag_id'
            }, {_mock: 'itemSummary'})
            data2.value = response.data.groups
        }
        onMounted(fetchItems2)

        const betterData3 = computed<{tag: Tag, amount: number, percent: number}[]>(() => {
            const total = data2.value.reduce((sum, item) => sum + item.amount, 0)
            return data2.value.map(item => ({
                ...item,
                percent: Math.round((item.amount / total) * 100)
            }))
        })

        watch(() => kind.value, () => {
            fetchItems1()
            fetchItems2()
        })
        onUnmounted(() => {
            preferenceStore.statisticsKind = kind.value
        })

        return () => (
            <div class={s.wrapper}>
                <FormItem label='类型' type='select' options={[
                    { value: GlobalConst.expenses, text: '支出' },
                    { value: GlobalConst.income, text: '收入' },
                ]} v-model={kind.value} />
                <LineChart data={betterData1.value} />
                <PieChart data={betterData2.value} />
                <Bars data={betterData3.value} />
            </div>
        )
    }
})