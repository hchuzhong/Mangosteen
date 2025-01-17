import { defineComponent, PropType, ref } from 'vue';
import s from './Tags.module.scss';
import { http } from '../../shared/Http';
import { useTags } from '../../shared/useTags';
import { Button } from '../../shared/Button';
import { Icon } from '../../shared/Icon';
import { RouterLink, useRouter } from 'vue-router';

export const Tags = defineComponent({
    props: {
        kind: {
            type: String as PropType<KindType>,
            required: true
        },
        selected: Number
    },
    emit: ['update:selected'],
    setup: (props, context) => {
        const router = useRouter()
        const {hasMore, noMoreThanOnePage, tags, fetchTags} = useTags((page) => {
            return http.get<Resources<Tag>>('/tags', { kind: props.kind, page: page + 1 }, {_mock: 'tagIndex', _autoLoading: true})
        })
        const timer = ref<number>()
        const currentTag = ref<HTMLDivElement>()
        const onLongPress = (tagId: Tag['id']) => {
            router.push(`/tags/edit/${tagId}?kind=${props.kind}`)
        }
        const onTouchStart = (e: TouchEvent, tag: Tag) => {
            timer.value = setTimeout(() => onLongPress(tag.id), 600)
            currentTag.value = e.currentTarget as HTMLDivElement
        }
        const onTouchEnd = (e: TouchEvent) => {
            clearTimeout(timer.value)
        }
        const onTouchMove = (e: TouchEvent) => {
            const pointedElement = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)
            if (!currentTag.value?.contains(pointedElement) && currentTag.value !== pointedElement) {
                clearTimeout(timer.value)
            }
        }
        return () => <>
            <div class={s.tags_wrapper} onTouchmove={onTouchMove}>
                <RouterLink to={`/tags/create?kind=${props.kind}`} class={s.tag}>
                    <div class={s.sign}><Icon name="add" class={s.createTag} /></div>
                    <div class={s.name}>Add</div>
                </RouterLink>
                {tags.value.map(tag =>
                    <div class={[s.tag, props.selected === tag.id ? s.selected : '']} 
                        onClick={() => context.emit('update:selected', tag.id)}
                        onTouchstart={(e) => onTouchStart(e, tag)} onTouchend={onTouchEnd}>
                        <div class={s.sign}>{tag.sign}</div>
                        <div class={s.name}>{tag.name}</div>
                    </div>
                )}
            </div>
            <div class={s.more}>
                {noMoreThanOnePage.value ? null : hasMore.value ? <Button class={s.loadMore} onClick={fetchTags}>Load More</Button> : <span class={s.nomore}>Nothing more</span> }
            </div>
        </>
    }
})