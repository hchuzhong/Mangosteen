import { defineComponent, onMounted, PropType, ref } from 'vue';
import s from './PieChart.module.scss';
import * as echarts from 'echarts';

export const PieChart = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const refDiv2 = ref<HTMLDivElement>()
        onMounted(() => {
            if (!refDiv2.value) return
            const myChart2 = echarts.init(refDiv2.value);
            // Draw the chart
            const option2 = {
                grid: [
                    { left: 0, top: 0, right: 0, bottom: 0 }
                ],
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            { value: 1048, name: 'Search Engine' },
                            { value: 735, name: 'Direct' },
                            { value: 580, name: 'Email' },
                            { value: 484, name: 'Union Ads' },
                            { value: 300, name: 'Video Ads' }
                        ],
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
            myChart2.setOption(option2);
        })
        return () => (
            <div ref={refDiv2} class={s.wrapper}></div>
        )
    }
})