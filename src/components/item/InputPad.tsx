import { defineComponent, PropType, ref } from 'vue';
import s from './InputPad.module.scss';
import { Icon } from '../../shared/Icon';
import { Time } from '../../shared/time';
import { DatetimePicker, Popup } from 'vant';

export const InputPad = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const appendText = (n: number | string) => {
            const nString = n.toString()
            const includeDot = refAmount.value.includes('.')
            const isDefaultValue = refAmount.value === '0'
            const amountLength = refAmount.value.length
            // 最多 13 个数字
            if (amountLength >= 13) return
            // 小数点后只能输入两位
            if (includeDot && amountLength - refAmount.value.indexOf('.') > 2) return
            // 只能出现一个 .
            if (nString === '.' && includeDot) return
            else if (isDefaultValue) {
                // 为 0 的时候不能继续输入 0
                if (nString === '0') return
                // 输入数字的时候需要把 0 替换掉
                if (nString !== '.') refAmount.value = ''
            }
            refAmount.value += nString
        }
        const buttons = [
            { text: '1', onClick: () => { appendText('1') }},
            { text: '2', onClick: () => { appendText('2') }},
            { text: '3', onClick: () => { appendText('3') }},
            { text: '4', onClick: () => { appendText('4') }},
            { text: '5', onClick: () => { appendText('5') }},
            { text: '6', onClick: () => { appendText('6') }},
            { text: '7', onClick: () => { appendText('7') }},
            { text: '8', onClick: () => { appendText('8') }},
            { text: '9', onClick: () => { appendText('9') }},
            { text: '.', onClick: () => { appendText('.') }},
            { text: '0', onClick: () => { appendText('0') }},
            { text: '清空', onClick: () => { refAmount.value = '0' }},
            { text: '提交', onClick: () => {}},

        ]
        const refDate = ref(new Date())
        const refDatePickerVisible = ref(false)
        const showDatePicker = () => refDatePickerVisible.value = true
        const hideDatePicker = () => refDatePickerVisible.value = false
        const setDate = (date: Date) => { 
            refDate.value = date
            hideDatePicker()
        }
        const refAmount = ref('0')
        return () => <>
            <div class={s.date_and_amount}>
                <span class={s.date}>
                    <Icon name='date' class={s.icon} />
                    <span>
                        <span onClick={showDatePicker}>{new Time(refDate.value).format()}</span>
                        <Popup position='bottom' v-model:show={refDatePickerVisible.value}>
                            <DatetimePicker
                                value={refDate.value}
                                type="date"
                                title="选择年月日"
                                onConfirm={setDate}
                                onCancel={hideDatePicker}
                            />
                        </Popup>
                    </span>
                </span>
                <span class={s.amount}>{refAmount.value}</span>
            </div>
            <div class={s.buttons}>
                {buttons.map(buttonCfg => <button onClick={buttonCfg.onClick}>{buttonCfg.text}</button>)}
            </div>
        </>
    }
})