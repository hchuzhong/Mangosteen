import { defineStore } from 'pinia'
import { http } from '../shared/Http'
import { AxiosResponse } from 'axios'

type State = {
    me?: User
    mePromise?: Promise<AxiosResponse<Resource<User>>>
}

type Actions = {
    refreshMe: () => void
    fetchMe: () => void
}

export const useMeStore = defineStore<string, State, {}, Actions>('me', {
    state: () => ({
        me: undefined,
        mePromise: undefined
    }),
    actions: {
        refreshMe() {
            this.mePromise = http.get<Resource<User>>('/me')
        },
        fetchMe() {
            this.refreshMe()
        }
    }
})