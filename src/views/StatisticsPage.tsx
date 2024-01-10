import { defineComponent } from 'vue';
import { Charts } from '../components/statistics/Charts';
import { TimeTabsLayout } from '../layouts/TimeTabsLayout';

export const StatisticsPage = defineComponent({
    setup: (props, context) => {
        return () => (
            <TimeTabsLayout tabType="statistics" hideThisYear={true} reRenderOnSelect={true} component={Charts} />
        )
    }
})

export default StatisticsPage