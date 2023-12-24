import { faker } from '@faker-js/faker'
import { AxiosRequestConfig } from 'axios';

type Mock = (config: AxiosRequestConfig) => [number, any]

export const mockItemCreate: Mock = (config) => {
    return [200, {"resource": {
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