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

export const ItemSummary = defineComponent({
    props: {
        startDate: String,
        endDate: String
    },
    setup: (props, context) => {
        if (!props.startDate || !props.endDate) return () => (<div>请先选择时间范围</div>)
        const itemStore = useItemStore(['items', props.startDate, props.endDate])()
        useAfterMe(() => itemStore.fetchItems(props.startDate, props.endDate))
        const itemsBalance = reactive({expenses: 0, income: 0, balance: 0})
        const fetchItemsBalace = async () => {
            if (!props.startDate || !props.endDate) return
            const response = await http.get('/items/balance', {
                happened_after: props.startDate,
                happened_before: props.endDate
            }, {_mock: 'itemIndexBalance'})
            Object.assign(itemsBalance, response.data)
        }
        useAfterMe(fetchItemsBalace)
        watch(() => [props.startDate, props.endDate], () => {
            itemStore.$reset()
            itemStore.fetchItems(props.startDate, props.endDate)
            Object.assign(itemsBalance, {expenses: 0, income: 0, balance: 0})
            fetchItemsBalace()
        })
        return () => (
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
                                    <span>{item.tags && item.tags[0] ? item.tags[0].sign : '💰'}</span>
                                </div>
                                <div class={s.text}>
                                    <div class={s.tagAndAmount}>
                                    <span class={s.tag}>{item.tags && item.tags[0] ? item.tags[0].name : '未分类'}</span>
                                    <span class={s[item.kind]}>￥<Money value={item.amount} /></span>
                                    </div>
                                    <div class={s.time}><DateTime value={item.happened_at} /></div>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <div class={s.more}>
                    {itemStore.hasMore ?
                        <Button onClick={() => itemStore.fetchNextPage(props.startDate, props.endDate)}>加载更多</Button> :
                        <span>没有更多</span>
                    }
                    </div>
                </>) : (<>
                    <Center class={s.pig_wrapper}>
                        <Icon name='pig' class={s.pig} />
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