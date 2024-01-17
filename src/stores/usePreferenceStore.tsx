import { defineStore } from 'pinia'
import { GlobalConst } from '../shared/globalConst'

type State = {
    itemsTab: keyof TimeType
    itemsCustomTime: CustomTimeType
    statisticsTab: Partial<keyof TimeType>
    statisticsKind: KindType
    statisticsCustomTime: CustomTimeType
    itemCreateKind: KindType
}

export const usePreferenceStore = defineStore<string, State>('preference', {
    state: () => ({
        itemsTab: GlobalConst.curMonth,
        itemsCustomTime: {},
        statisticsTab: GlobalConst.curMonth,
        statisticsKind: GlobalConst.expenses,
        statisticsCustomTime: {},
        itemCreateKind: GlobalConst.expenses,
    })
})