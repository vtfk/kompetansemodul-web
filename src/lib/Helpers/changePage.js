import { displayedPage, editingPersonalia, infoOpen } from '../services/store'

export const changePage = (pageName) => {
    // window.history.replaceState(null, null, pageName)
    editingPersonalia.set( {isEditing: false, editBlock: 'ingen'} )
    infoOpen.set('')
    displayedPage.set(pageName)
    console.log(window.location.pathname)
}



