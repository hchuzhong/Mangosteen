import { faker } from '@faker-js/faker'
import { AxiosRequestConfig } from 'axios';

type Mock = (config: AxiosRequestConfig) => [number, any]

export const mockItemIndexBalance: Mock = (config) => {
    return [200, {
        expenses: 19900,
        income: 9900,
        balance: 10000
    }]
}

export const mockItemIndex: Mock = (config) => {
    const { kind, page } = config.params
    const per_page = 25
    const count = 26
    const createPaper = (page = 1) => ({
        page,
        per_page,
        count,
    })
    const createTag = () => ({
        id: createId(),
        name: faker.word.noun(),
        sign: faker.internet.emoji(),
        kind: 'income'
    })
    const createItem = (n = 1, attrs?: any) =>
        Array.from({ length: n }).map(() => ({
            id: createId(),
            user_id: createId(),
            amount: Math.floor(Math.random() * 10000),
            tags: [createTag()],
            happened_at: faker.date.past().toISOString(),
            kind: config.params.kind,
        }))
    const createBody = (n = 1, attrs?: any) => ({
        resources: createItem(n),
        pager: createPaper(page),
    })
    if (!page || page === 1) {
        return [200, createBody(25)]
    } else if (page === 2) {
        return [200, createBody(1)]
    }else{
        return [200, {}]
    }
}

export const mockTagShow: Mock = (config) => {
    const createTag = () => ({
        id: createId(),
        name: faker.word.noun(),
        sign: faker.internet.emoji(),
        kind: 'income'
    })
    return [200, {resource: createTag()}]
}

export const mockItemCreate: Mock = (config) => {
    return [200, {resource: {
        "id": 695,
        "user_id": 277,
        "amount": 100,
        "note": null,
        "tags_id": [319],
        "happened_at": "2023-12-21T05:27:26.108Z",
        "created_at": "2023-12-21T05:27:26.137Z",
        "updated_at": "2023-12-21T05:27:26.137Z",
        "kind": "expenses"
    }}]
}

export const mockSession: Mock = (config) => {
    return [200, {
        jwt: faker.word.adjective(128)
    }]
}

let id = 0
const createId = () => {
    id += 1
    return id
}
export const mockTagIndex: Mock = (config) => {
    const {kind, page} = config.params
    const per_page = 25
    const count = 26
    const createPager = (page = 1) => ({
        page, per_page, count
    })
    const createBody = (n = 1, attrs?: any) => ({
        resources: createTag(n), pager: createPager(page)
    })
    const createTag = (n = 1, attrs?: any) => 
        Array.from({ length: n }).map(() => ({
            ...attrs,
            id: createId(),
            name: faker.word.noun(),
            sign: faker.internet.emoji(),
            kind
        }))
    if (kind === 'expenses') {
        if (page === 1 || !page) {
            return [200, createBody(25)]
        } else {
            return [200, createBody(1)]
        }
    } else {
        if (page === 1 || !page) {
            return [200, createBody(25)]
        } else {
            return [200, createBody(1)]
        }
    }
}