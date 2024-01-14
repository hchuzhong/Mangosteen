import { computed, defineComponent, PropType, ref } from 'vue';
import s from './EmojiSelect.module.scss';
import { emojiList } from './emojiList';

export const EmojiSelect = defineComponent({
    props: {
        modelValue: {
            type: String as PropType<string>
        },
        onUpdateModelValue: {
            type: Function as PropType<(emoji: string) => void>
        }
    },
    setup: (props, context) => {
        const table: [string, string[]][] = [
            ['Emotion', ['face-smiling', 'face-affection', 'face-tongue', 'face-hand',
            'face-neutral-skeptical', 'face-sleepy', 'face-unwell', 'face-hat',
            'face-glasses', 'face-concerned', 'face-negative', 'face-costume'
            ]],
            ['Gesture', ['hand-fingers-open', 'hand-fingers-partial', 'hand-single-finger',
            'hand-fingers-closed', 'hands', 'hand-prop', 'body-parts']],
            ['Character', ['person', 'person-gesture', 'person-role', 'person-fantasy',
            'person-activity', 'person-sport', 'person-resting']],
            ['Clothes', ['clothing']],
            ['Animal', ['cat-face', 'monkey-face', 'animal-mammal', 'animal-bird',
            'animal-amphibian', 'animal-reptile', 'animal-marine', 'animal-bug']],
            ['Plant', ['plant-flower', 'plant-other']],
            ['Nature', ['sky & weather', 'science']],
            ['Food', [
            'food-fruit', 'food-vegetable', 'food-prepared', 'food-asian',
            'food-marine', 'food-sweet'
            ]],
            ['Sport', ['sport', 'game']],
        ]
        const refSelected = ref(0)
        const onClickEmoji = (emoji: string) => {
            if (props.onUpdateModelValue) {
                props.onUpdateModelValue(emoji)
            } else {
                context.emit('update:modelValue', emoji)
            }
        }
        const emojis = computed(() => {
            const selectedItem = table[refSelected.value][1]
            return selectedItem.map(category => 
                emojiList.find(array => array[0] === category)
                ?.[1]?.map(emoji => <li class={{[s.selectedEmoji]: props.modelValue === emoji}} onClick={() => onClickEmoji(emoji)}>{emoji}</li>)
            )
        })
        return () => (
            <div class={s.emojiList}>
                <nav>
                    {table.map((item, index) => 
                        <span class={{[s.selected]: refSelected.value === index}} onClick={() => refSelected.value = index}>{item[0]}</span>)}
                </nav>
                <ol>
                    {emojis.value}
                </ol>
            </div>
        )
    }
})