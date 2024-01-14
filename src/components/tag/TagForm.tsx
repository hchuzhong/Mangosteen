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
        if (!kind) return () => <div>parameter error</div>
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
                { key: 'name', type: 'required', message: 'Name is required' },
                { key: 'name', type: 'pattern', regex: /^.{1,4}$/, message: 'Only 1 to 4 characters are allowed' },
                { key: 'sign', type: 'required', message: 'Symbol is required' },
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
                <FormItem label='Tag Name(4 characters max)' type='text' v-model={formData.name} error={errors.value['name']?.join(' ')} />
                <FormItem label={'Symbol' + formData.sign} type='emojiSelect' v-model={formData.sign} error={errors.value['sign']?.join(' ')} />
                <FormItem><p class={s.tips}>Long press tabs for editing during bookkeeping</p></FormItem>
                <FormItem><Button type="submit" class={[s.formItem, s.button]}>Confirm</Button></FormItem>
            </Form>
        )
    }
})