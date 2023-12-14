import { defineComponent, reactive, ref } from 'vue';
import s from './Tag.module.scss';
import { Button } from '../../shared/Button';
import { Rules, validate } from '../../shared/validate';
import { Form, FormItem } from '../../shared/Form';

export const TagForm = defineComponent({
    setup: (props, context) => {
        const formData = reactive({
            name: '',
            sign: '',
        })
        const errors = ref<{[k in keyof typeof formData]?: string[]}>({})
        const onSubmit = (e: Event) => {
            const rules: Rules<typeof formData> = [
                { key: 'name', type: 'required', message: '必填' },
                { key: 'name', type: 'pattern', regex: /^.{1,4}$/, message: '只能填 1 到 4 个字符' },
                { key: 'sign', type: 'required', message: '必填' },
            ]
            errors.value = validate(formData, rules)
            e.preventDefault()
        }
        return () => (
            <Form onSubmit={onSubmit}>
                <FormItem label='标签名' type='text' modelValue={formData.name} error={errors.value['name']?.join(' ')} />
                <FormItem label={'符号' + formData.sign} type='emojiSelect' modelValue={formData.sign} error={errors.value['sign']?.join(' ')} />
                <FormItem><p class={s.tips}>记账时长按标签即可进行编辑</p></FormItem>
                <FormItem><Button class={[s.formItem, s.button]}>确定</Button></FormItem>
            </Form>
        )
    }
})