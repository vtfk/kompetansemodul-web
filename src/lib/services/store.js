import { writable } from 'svelte/store'

export const msalClientStore = writable(null)
export const displayedPage = writable('personalia')
export const searchParameter = writable(null)
export const unitParameter = writable(null)
export const prevUnit = writable(null)
export const editingPersonalia = writable({
  isEditing: false,
  editBlock: 'ingen akkurat nå'
})
export const infoOpen = writable('')
export const clickedAcosLogon = writable(false)
