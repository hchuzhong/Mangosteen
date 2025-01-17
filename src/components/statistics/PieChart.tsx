import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
import s from './PieChart.module.scss';
import * as echarts from 'echarts';
import { formatMoney } from '../../shared/Money';

const echartsOption = {
    tooltip: {
        trigger: 'item',
        formatter: (data: {name: string, value: number, percent: number}) => {
            const { name, value, percent } = data
            return `${name}: ￥${formatMoney(value)} occupied ${percent}%`
        }
    },
    grid: [
        { left: 0, top: 0, right: 0, bottom: 0 }
    ],
    series: [
        {
            type: 'pie',
            radius: '70%',
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

export const PieChart = defineComponent({
    props: {
        data: {
            type: Array as PropType<{name: string, value: number}[]>
        }
    },
    setup: (props, context) => {
        const refDiv2 = ref<HTMLDivElement>()
        let chart: echarts.ECharts | undefined = undefined
        onMounted(() => {
            if (!refDiv2.value) return
            chart = echarts.init(refDiv2.value);
            chart.setOption(echartsOption)
        })
        watch(() => props.data, () => {
            chart?.setOption({
                series: [{
                    data: props.data,
                }]
            })
        })
        return () => (
            <div ref={refDiv2} class={s.wrapper}></div>
        )
    }
})