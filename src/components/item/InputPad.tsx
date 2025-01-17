import { defineComponent, PropType, ref } from 'vue';
import s from './InputPad.module.scss';
import { Icon } from '../../shared/Icon';
import { Time } from '../../shared/time';
import { DatetimePicker, Popup } from 'vant';

export const InputPad = defineComponent({
    props: {
        happenAt: String,
        amount: Number,
        onSubmit: {
            type: Function as PropType<() => void>
        }
    },
    emit: ['update:happenAt', 'update:amount'],
    setup: (props, context) => {
        const appendText = (n: number | string) => {
            const nString = n.toString()
            const includeDot = refAmount.value.includes('.')
            const isDefaultValue = refAmount.value === '0'
            const amountLength = refAmount.value.length
            // Maximum 13 digits
            if (amountLength >= 13) return
            // Enter only two digits after the decimal point
            if (includeDot && amountLength - refAmount.value.indexOf('.') > 2) return
            // Only one can appear .
            if (nString === '.' && includeDot) return
            else if (isDefaultValue) {
                // Cannot continue to enter 0 when it is 0
                if (nString === '0') return
                // You need to replace the 0 when entering numbers
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
            { text: 'Clear', onClick: () => { refAmount.value = '0' }},
            { text: 'Submit', onClick: () => { 
                    context.emit('update:amount', parseFloat(refAmount.value) * 100)
                    props.onSubmit?.()
                }
            },
        ]
        const refDatePickerVisible = ref(false)
        const showDatePicker = () => (refDatePickerVisible.value = true)
        const hideDatePicker = () => (refDatePickerVisible.value = false)
        const setDate = (date: Date) => { 
            context.emit('update:happenAt', date.toISOString())
            hideDatePicker()
        }
        const refAmount = ref(props.amount ? (props.amount / 100).toString() : '0' )
        return () => <>
            <div class={s.date_and_amount}>
                <span class={s.date}>  
                    <Icon name='date' class={s.icon} />
                    <span>
                        <span onClick={showDatePicker}>{new Time(props.happenAt).format()}</span>
                        <Popup position='bottom' v-model:show={refDatePickerVisible.value}>
                            <DatetimePicker
                                modelValue={props.happenAt ? new Date(props.happenAt) : new Date()}
                                type="date"
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