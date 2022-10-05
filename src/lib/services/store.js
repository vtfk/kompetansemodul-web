import { writable } from 'svelte/store'

export const msalClientStore = writable(null)
export const displayedPage = writable('personalia')
export const searchParameter = writable(null)
export const editingPersonalia = writable({
    isEditing: false,
    editBlock: 'ingen akkurat nå'
})
