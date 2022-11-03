import { displayedPage, editingPersonalia, infoOpen, searchParameter, unitParameter } from '../services/store'

export const changePage = (pageName, options) => {
    // window.history.replaceState(null, null, pageName)
    if (options?.setPerson) searchParameter.set(options.setPerson)
    if (options?.setUnit) unitParameter.set(options.unitParameter)
    editingPersonalia.set( {isEditing: false, editBlock: 'ingen'} )
    infoOpen.set('')
    displayedPage.set(pageName)
    console.log(window.location.pathname)
}

