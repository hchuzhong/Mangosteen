import { defineComponent } from 'vue';
import { MainLayout } from '../../layouts/MainLayout';
import { TagForm } from './TagForm';
import { Button } from '../../shared/Button';
import s from './Tag.module.scss';
import { BackIcon } from '../../shared/BackIcon';
import { useRouter } from 'vue-router';
import { http } from '../../shared/Http';
import { Dialog } from 'vant';

export const TagEdit = defineComponent({
    setup: (props, context) => {
        const router = useRouter()
        const numberId = parseInt(router.currentRoute.value.params.id!.toString())
        if (Number.isNaN(numberId)) return () => <div>id 不存在</div>
        const onDelete = async (option?: { withItem?: boolean }) => {
            await Dialog.confirm({
                title: '确认',
                message: option?.withItem ? '删除标签后，该标签下的所有记账也将被删除，是否继续？' : '是否要删除该标签？'
            })
            await http.delete(`/api/tags/${numberId}`, { withItem: option?.withItem ? 'true' : 'false' })
                .catch(() => Dialog.alert({title: '提示', message: '删除失败'}))
            router.back()
        }
        return () => (
            <MainLayout>{{
                title: () => '编辑标签',
                icon: () => <BackIcon />,
                default: () => <>
                    <TagForm id={numberId} />
                    <div class={s.actions}>
                        <Button class={s.removeTags} level='danger' onClick={() => onDelete()} >删除标签</Button>
                        <Button class={s.removeTagsAndItems} level='danger' onClick={() => onDelete({withItem: true})} >删除标签和记账</Button>
                    </div>
                </>
            }}</MainLayout>
        )
    }
})