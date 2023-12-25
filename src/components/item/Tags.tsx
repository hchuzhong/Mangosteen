import { defineComponent, PropType, ref } from 'vue';
import s from './Tags.module.scss';
import { http } from '../../shared/Http';
import { useTags } from '../../shared/useTags';
import { Button } from '../../shared/Button';
import { Icon } from '../../shared/Icon';
import { RouterLink } from 'vue-router';

export const Tags = defineComponent({
    props: {
        kind: {
            type: String as PropType<'expenses' | 'income'>,
            required: true
        },
        selected: Number
    },
    emit: ['update:selected'],
    setup: (props, context) => {
        const {hasMore, tags, fetchTags} = useTags((page) => {
            return http.get<Resources<Tag>>('/tags', { kind: props.kind, page: page + 1, _mock: 'tagIndex' })
        })
        const timer = ref<number>()
        const currentTag = ref<HTMLDivElement>()
        const onLongPress = () => {
            clearTimeout(timer.value)
            console.log('had been long press')
        }
        const onTouchStart = (e: TouchEvent) => {
            timer.value = setTimeout(onLongPress, 600)
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
                    <div class={s.sign}>
                        <Icon name="add" class={s.createTag} />
                    </div>
                    <div class={s.name}>
                        新增
                    </div>
                </RouterLink>
                {tags.value.map(tag =>
                    <div class={[s.tag, props.selected === tag.id ? s.selected : '']} 
                        onClick={() => context.emit('update:selected', tag.id)}
                        onTouchstart={onTouchStart} onTouchend={onTouchEnd}>
                        <div class={s.sign}>
                            {tag.sign}
                        </div>
                        <div class={s.name}>
                            {tag.name}
                        </div>
                    </div>
                )}
            </div>
            <div class={s.more}>
                {hasMore.value ? <Button class={s.loadMore} onClick={fetchTags}>加载更多</Button> : <span class={s.nomore}>没有更多内容了</span> }
            </div>
        </>
    }
})