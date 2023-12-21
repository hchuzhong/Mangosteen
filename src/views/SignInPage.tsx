import { defineComponent, PropType, reactive, ref } from 'vue';
import s from './SignInPage.module.scss';
import { MainLayout } from '../layouts/MainLayout';
import { Icon } from '../shared/Icon';
import { Form, FormItem } from '../shared/Form';
import { Button } from '../shared/Button';
import { validate } from '../shared/validate';
import axios from 'axios';

export const SignInPage = defineComponent({
    props: {
        name: {
            type: String as PropType<string>
        }
    },
    setup: (props, context) => {
        const refValidationCode = ref()
        const formData = reactive({
            email: '',
            code: ''
        })
        const errors = ref<{ [k in keyof typeof formData]?: string[] }>({})
        const onSumit = async (e: Event) => {
            e.preventDefault()
            errors.value = validate(formData, [
                { key: 'email', type: 'required', message: '必填' },
                { key: 'email', type: 'pattern', regex: /.+@.+/, message: '必须是邮箱地址' },
                { key: 'code', type: 'required', message: '必填' },
                { key: 'code', type: 'pattern', regex: /^\d{6}$/, message: '必须是六位数字' },
            ])
            if (Object.values(errors.value).length) return
            // const response = await axios.post('/api/v1/session', {email: formData.email, code: formData.code})
        }
        const onClickValidationCode = async (e: Event) => {
            console.log('haha');
            // const response = await axios.post('/api/v1/validation_codes', {email: formData.email})
            refValidationCode.value.startCount()
        }
        return () => (
            <MainLayout>{{
                title: () => '登录',
                icon: () => <Icon name='left' />,
                default: () => (
                    <div>
                        <div class={s.logo}>
                            <Icon class={s.icon} name="mangosteen" />
                            <h1 class={s.appName}>山竹记账</h1>
                        </div>
                        <Form onSubmit={onSumit}>
                            <FormItem label='邮箱地址' type='text' v-model={formData.email} error={errors.value.email?.[0]} placeholder='请输入邮箱，然后点击发送验证码' />
                            <FormItem ref={refValidationCode} label='验证码' type='validationCode' v-model={formData.code} error={errors.value.code?.[0]} buttonLabel='发送验证码' countFrom={60} placeholder='请输入六位数字' onClick={onClickValidationCode} />
                            <FormItem style={{ paddingTop: '96px' }}> 
                                <Button>登录</Button>
                            </FormItem>
                        </Form>
                    </div>
                )
            }}</MainLayout>
        )
    }
})