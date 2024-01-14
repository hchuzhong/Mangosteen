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
        if (Number.isNaN(numberId)) return () => <div>id doesn't exist</div>
        const onDelete = async (option?: { with_items?: boolean }) => {
            await Dialog.confirm({
                title: 'Confirm',
                message: option?.with_items ? 'After the tag is deleted, all accounts under the tag will also be deleted. Want to continue?' : 'Do you want to delete the tag?'
            })
            await http.delete(`/tags/${numberId}`, { with_items: option?.with_items ? 'true' : 'false' }, {_autoLoading: true})
                .catch(() => Dialog.alert({title: 'Tips', message: 'Delete Failed'}))
            router.back()
        }
        return () => (
            <MainLayout>{{
                title: () => 'Edit Tag',
                icon: () => <BackIcon />,
                default: () => <>
                    <TagForm id={numberId} />
                    <div class={s.actions}>
                        <Button class={s.removeTags} level='danger' onClick={() => onDelete()} >Delete Tag</Button>
                        <Button class={s.removeTagsAndItems} level='danger' onClick={() => onDelete({with_items: true})} >Delete accounts</Button>
                    </div>
                </>
            }}</MainLayout>
        )
    }
})