import { defineComponent, onMounted, PropType, ref } from 'vue';
import s from './LineChart.module.scss';
import * as echarts from 'echarts';

export const LineChart = defineComponent({
    setup: (props, context) => {
        const refDiv1 = ref<HTMLDivElement>()
        onMounted(() => {
            if (!refDiv1.value) return
            const myChart1 = echarts.init(refDiv1.value);
            // Draw the chart
            const option1 = {
                grid: [
                    { left: 0, top: 0, right: 0, bottom: 20 }
                ],
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [150, 230, 224, 218, 135, 147, 260],
                        type: 'line'
                    }
                ]
            };
            myChart1.setOption(option1);
        })
        return () => (
            <div ref={refDiv1} class={s.wrapper}></div>
        )
    }
})