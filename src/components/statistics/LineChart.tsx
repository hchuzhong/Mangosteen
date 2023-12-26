import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
import s from './LineChart.module.scss';
import * as echarts from 'echarts';
import { Time } from '../../shared/time';
import { formatMoney } from '../../shared/Moeny';

const echartsOption = {
    tooltip: {
        show: true,
        trigger: 'axis',
        formatter: ([item]: any) => {
            const [x, y] = item.data
            return `${new Time(new Date(x)).format('YYYY年MM月DD日')} ￥${formatMoney(y)}`
        },
    },
    grid: [{ left: 16, top: 20, right: 16, bottom: 20 }],
    xAxis: {
        type: 'time',
        boundaryGap: ['3%', '0%'],
        axisLabel: {
            formatter: (value: string) => new Time(new Date(value)).format('MM-DD'),
        },
        axisTick: {
            alignWithLabel: true,
        },
    },
    yAxis: {
        show: true,
        type: 'value',
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed',
            },
        },
        axisLabel: {
            show: false,
        },
    },
}

export const LineChart = defineComponent({
    props: {
        data: {
            type: Array as PropType<[string, number][]>,
            required: true
        }
    },
    setup: (props, context) => {
        const refDiv1 = ref<HTMLDivElement>()
        let chart: echarts.ECharts | undefined = undefined
        onMounted(() => {
            if (!refDiv1.value) return
            chart = echarts.init(refDiv1.value);
            chart.setOption({
                ...echartsOption,
                series: [
                    {
                        data: props.data,
                        type: 'line'
                    }
                ]
            })
        })
        watch(() => props.data, () => {
            chart?.setOption({
                series: [
                    {
                        data: props.data,
                    }
                ]
            })
        })
        return () => (
            <div ref={refDiv1} class={s.wrapper}></div>
        )
    }
})