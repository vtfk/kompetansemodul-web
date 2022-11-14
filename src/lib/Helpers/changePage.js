import { displayedPage, editingPersonalia, infoOpen, searchParameter, unitParameter, prevUnit } from '../services/store'

export const changePage = (pageName, options) => {
    // window.history.replaceState(null, null, pageName)
    if (options?.setPerson) searchParameter.set(options.setPerson)
    if (options?.setUnit) unitParameter.set(options.setUnit)
    if (options?.setPrevious) {
        prevUnit.set(options.setPrevious)
    } else {
        prevUnit.set(null)
    }
    editingPersonalia.set( {isEditing: false, editBlock: 'ingen'} )
    infoOpen.set('')
    displayedPage.set(pageName)
}

