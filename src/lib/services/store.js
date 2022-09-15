import { writable } from 'svelte/store'

export const msalClientStore = writable(null)
export const displayedPage = writable('')
export const searchUpn = writable('ehi')
