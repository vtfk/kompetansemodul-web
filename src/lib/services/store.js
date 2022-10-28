import { writable } from 'svelte/store'

export const msalClientStore = writable(null)
export const displayedPage = writable('personalia')
export const searchParameter = writable(null)
export const editingPersonalia = writable({
  isEditing: false,
  editBlock: 'ingen akkurat nå'
})
export const infoOpen = writable('')
export const cardAction = writable({
  open: false,
  block: 'ingen akkurat nå'
})
