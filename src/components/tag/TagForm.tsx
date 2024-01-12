import { defineComponent, onMounted, reactive, ref } from 'vue';
import s from './Tag.module.scss';
import { Button } from '../../shared/Button';
import { Rules, hasError, validate } from '../../shared/validate';
import { Form, FormItem } from '../../shared/Form';
import { useRouter } from 'vue-router';
import { http } from '../../shared/Http';
import { onFormError } from '../../shared/onFormError';

export const TagForm = defineComponent({
    props: {
        id: Number
    },
    setup: (props, context) => {
        const router = useRouter()
        const kind = router.currentRoute.value.query.kind?.toString()
        if (!kind) return () => <div>参数错误</div>
        const formData = reactive<Partial<Tag>>({
            id: undefined,
            name: '',
            sign: '',
            kind: kind as KindType
        })
        const errors = ref<FormErrors<typeof formData>>({})
        const onSubmit = async (e: Event) => {
            e.preventDefault()
            const rules: Rules<typeof formData> = [
                { key: 'name', type: 'required', message: '必填' },
                { key: 'name', type: 'pattern', regex: /^.{1,4}$/, message: '只能填 1 到 4 个字符' },
                { key: 'sign', type: 'required', message: '必填' },
            ]
            errors.value = validate(formData, rules)
            if (hasError(errors.value)) return
            const promise = await formData.id ? http.patch(`/tags/${formData.id}`, formData, {_mock: 'editTag', _autoLoading: true}) : http.post('/tags', formData, {_mock: 'getTag', _autoLoading: true})
            await promise.catch(error => onFormError(error, (data) => errors.value = data.errors))
            router.back()
        }
        onMounted(async () => {
            if (!props.id) return
            const response = await http.get<Resource<Tag>>(`/tags/${props.id}`, {}, {_mock: 'getTag', _autoLoading: true})
            Object.assign(formData, response.data.resource)
        })
        return () => (
            <Form onSubmit={onSubmit}>
                <FormItem label='标签名(最多4个字符)' type='text' v-model={formData.name} error={errors.value['name']?.join(' ')} />
                <FormItem label={'符号' + formData.sign} type='emojiSelect' v-model={formData.sign} error={errors.value['sign']?.join(' ')} />
                <FormItem><p class={s.tips}>记账时长按标签即可进行编辑</p></FormItem>
                <FormItem><Button type="submit" class={[s.formItem, s.button]}>确定</Button></FormItem>
            </Form>
        )
    }
})