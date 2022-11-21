export function repackPosTitle(mainTitle, type) {
    if(!mainTitle) return 'Fant ikke stillingsinfo'
    if(!type) return mainTitle
    if(type !== 'ikkeRelevant') {
        const titleString = `${mainTitle} (${type})` 
        return titleString
    }
    else {
        return mainTitle
    }
}