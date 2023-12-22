import { ref } from "vue"

export const useBool = (initialValue: boolean) => {
    const bool = ref(initialValue)
    const toggle = () => bool.value = !bool.value
    const on = () => bool.value = true
    const off = () => bool.value = false
    return { ref: bool, toggle, on, off }
}