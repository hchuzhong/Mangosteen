import { defineComponent } from 'vue';
import { MainLayout } from '../../layouts/MainLayout';
import { TagForm } from './TagForm';
import { Button } from '../../shared/Button';
import s from './Tag.module.scss';
import { BackIcon } from '../../shared/BackIcon';

export const TagEdit = defineComponent({
    setup: (props, context) => {
        return () => (
            <MainLayout>{{
                title: () => '编辑标签',
                icon: () => <BackIcon />,
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