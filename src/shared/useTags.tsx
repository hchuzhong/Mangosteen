import { ref, onMounted } from 'vue';
import { AxiosResponse } from 'axios';

type Fetcher = (page: number) => Promise<AxiosResponse<Resources<Tag>>>
export const useTags = (fetcher: Fetcher) => {
    const page = ref(0)
    const hasMore = ref(false)
    const noMoreThanOnePage = ref(false)
    const tags = ref<Tag[]>([])
    const fetchTags = async () => {
        const response = await fetcher(page.value)
        const { resources, pager } = response.data
        tags.value.push(...resources)
        page.value = pager.page
        hasMore.value = ((pager.page - 1) * pager.per_page + resources.length < pager.count)
        noMoreThanOnePage.value = pager.per_page >= pager.count
    }
    onMounted(fetchTags)
    return { page, hasMore, noMoreThanOnePage, tags, fetchTags }
}