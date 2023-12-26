import { computed, defineComponent, ref, onMounted } from 'vue';
import s from './Charts.module.scss';
import { FormItem } from '../../shared/Form';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { Bars } from './Bars';
import { http } from '../../shared/Http';
import { Time } from '../../shared/time';

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
        const kind = ref('expenses')
        const data = ref<Data>([])
        const betterData = computed<[string, number][]>(() => {
            if (!props.startDate || !props.endDate) return []
            const dataObj: Record<string, number> = {}
            data.value.forEach(item => (dataObj[new Time(item.happened_at).getTimeStamp()] = item.amount))
            const diff = new Date(props.endDate).getTime() - new Date(props.startDate).getTime()
            const days = diff / DAY + 1
            return Array.from({length: days}).map((_, i) => {
                const time = new Time(props.startDate).add(i, 'day').getTimeStamp()
                return [new Date(time).toISOString(), dataObj[time] || 0 ]
            }) as [string, number][]
        })
        onMounted(async () => {
            if (!props.startDate || !props.endDate) return
            const response = await http.get<{groups: Data, summary: number}>('/items/summary', {
                happen_after: props.startDate,
                happen_before: props.endDate,
                kind: kind.value,
                group_by: 'happened_at',
                _mock: 'itemSummary'
            })
            data.value = response.data.groups
        })

        const data2 = ref<Data2>([])
        const betterData2 = computed<{name: string, value: number}[]>(() => {
            return data2.value.map(item => ({name: item.tag.name, value: item.amount}))
        })
        onMounted(async () => {
            if (!props.startDate || !props.endDate) return
            const response = await http.get<{groups: Data2, summary: number}>('/items/summary', {
                happen_after: props.startDate,
                happen_before: props.endDate,
                kind: kind.value,
                group_by: 'tag_id',
                _mock: 'itemSummary'
            })
            data2.value = response.data.groups
        })

        return () => (
            <div class={s.wrapper}>
                <FormItem label='类型' type='select' options={[
                    { value: 'expenses', text: '支出' },
                    { value: 'income', text: '收入' },
                ]} v-model={kind.value} />
                <LineChart data={betterData.value} />
                <PieChart data={betterData2.value} />
                <Bars />
            </div>
        )
    }
})