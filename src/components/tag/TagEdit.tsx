import { defineComponent } from 'vue';
import { MainLayout } from '../../layouts/MainLayout';
import { Icon } from '../../shared/Icon';
import { TagForm } from './TabForm';
import { Button } from '../../shared/Button';
import s from './Tag.module.scss';

export const TagEdit = defineComponent({
    setup: (props, context) => {
        return () => (
            <MainLayout>{{
                title: () => '编辑标签',
                icon: () => <Icon name='left' onClick={() => {}} />,
                default: () => <>
                    <TagForm />
                    <div class={s.actions}>
                        <Button class={s.removeTags} level='danger' >删除标签</Button>
                        <Button class={s.removeTagsAndItems} level='danger' >删除标签和记账</Button>
                    </div>
                </>
            }}</MainLayout>
        )
    }
})