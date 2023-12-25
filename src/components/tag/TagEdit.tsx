import { defineComponent } from 'vue';
import { MainLayout } from '../../layouts/MainLayout';
import { TagForm } from './TagForm';
import { Button } from '../../shared/Button';
import s from './Tag.module.scss';
import { BackIcon } from '../../shared/BackIcon';
import { useRoute } from 'vue-router';

export const TagEdit = defineComponent({
    setup: (props, context) => {
        const route = useRoute()
        const numberId = parseInt(route.params.id!.toString())
        if (Number.isNaN(numberId)) return () => <div>id 不存在</div>
        return () => (
            <MainLayout>{{
                title: () => '编辑标签',
                icon: () => <BackIcon />,
                default: () => <>
                    <TagForm id={numberId} />
                    <div class={s.actions}>
                        <Button class={s.removeTags} level='danger' >删除标签</Button>
                        <Button class={s.removeTagsAndItems} level='danger' >删除标签和记账</Button>
                    </div>
                </>
            }}</MainLayout>
        )
    }
})