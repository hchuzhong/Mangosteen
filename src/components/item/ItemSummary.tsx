import { defineComponent, watch, ref, onMounted, reactive } from 'vue';
import s from './ItemSummary.module.scss';
import { http } from '../../shared/Http';
import { Button } from '../../shared/Button';
import { Money } from '../../shared/Money';
import { DateTime } from '../../shared/DateTime';
import { Center } from '../../shared/Center';
import { Icon } from '../../shared/Icon';
import { RouterLink } from 'vue-router';
import { useAfterMe } from '../../hooks/useAfterMe';
import { useItemStore } from '../../stores/useItemStore';
import { noKindText, noKindEmoji } from '../../shared/globalConst';
import { Time } from '../../shared/time';

export const ItemSummary = defineComponent({
    props: {
        startDate: String,
        endDate: String
    },
    setup: (props, context) => {
        const itemStore = useItemStore(['items', props.startDate, props.endDate])()
        const itemsBalance = reactive({expenses: 0, income: 0, balance: 0})
        const fetchItemsBalace = async (startDate?: string, endDate?: string) => {
            if (!startDate || !endDate) return
            const response = await http.get('/items/balance', {
                happened_after: startDate,
                happened_before: endDate
            }, {_mock: 'itemIndexBalance'})
            Object.assign(itemsBalance, response.data)
        }
        useAfterMe(() => {
            if (!props.startDate || !props.endDate) return
            const {startDate, endDate} = new Time().wrapDate(props.startDate, props.endDate)
            fetchItemsBalace(startDate, endDate)
            itemStore.fetchItems(startDate, endDate)
        })
        watch(() => [props.startDate, props.endDate], () => {
            if (!props.startDate || !props.endDate) return
            itemStore.$reset()
            const {startDate, endDate} = new Time().wrapDate(props.startDate, props.endDate)
            itemStore.fetchItems(startDate, endDate)
            Object.assign(itemsBalance, {expenses: 0, income: 0, balance: 0})
            fetchItemsBalace(startDate, endDate)
        })
        const fetchNextPage = () => {
            if (!props.startDate || !props.endDate) return
            const {startDate, endDate} = new Time().wrapDate(props.startDate, props.endDate)
            itemStore.fetchNextPage(startDate, endDate)
        }
        return () => (
            (!props.startDate || !props.endDate) ? <div>请先选择时间范围</div> :
            <div class={s.wrapper}>
                {itemStore.items && itemStore.items.length ? (<>
                    <ul class={s.total}>
                        <li>
                            <span>收入</span>
                            <span><Money value={itemsBalance.income} /></span>
                        </li>
                        <li>
                            <span>支出</span>
                            <span><Money value={itemsBalance.expenses} /></span>
                        </li>
                        <li>
                            <span>净收入</span>
                            <span><Money value={itemsBalance.balance} /></span>
                        </li>
                    </ul>
                    <ol class={s.list}>
                        {itemStore.items.map((item) => (
                            <li>
                                <div class={s.sign}>
                                    <span>{item.tags && item.tags[0] ? item.tags[0].sign : noKindEmoji}</span>
                                </div>
                                <div class={s.text}>
                                    <div class={s.tagAndAmount}>
                                    <span class={s.tag}>{item.tags && item.tags[0] ? item.tags[0].name : noKindText}</span>
                                    <span class={s[item.kind]}>￥<Money value={item.amount} /></span>
                                    </div>
                                    <div class={s.time}><DateTime value={item.happened_at} /></div>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <div class={s.more}>
                    {itemStore.hasMore ?
                        <Button onClick={fetchNextPage}>加载更多</Button> :
                        <p>没有更多</p>
                    }
                    </div>
                </>) : (<>
                    <Center class={s.pig_wrapper} direction='|'>
                        <Icon name='pig' class={s.pig} />
                        <p>目前没有数据</p>
                    </Center>
                    <div class={s.button_wrapper}>
                        <RouterLink to='/items/create'>
                            <Button class={s.button}>开始记账</Button>
                        </RouterLink>
                    </div>
                </>)}
            </div>
        )
    }
})