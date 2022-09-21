import { writable } from 'svelte/store'

export const msalClientStore = writable(null)
export const displayedPage = writable('')
export const searchUpn = writable('noen.andre@vtfk.no')
export const editingPersonalia = writable({
    isEditing: false,
    editBlock: 'ingen akkurat nå'
})
