import fagbrev from '../../assets/fagbrevUDIR.json'

export function getFagbrev (variantName) {
    let fagbrevList = []
    const programVariantNavn = fagbrev.filter(programName => programName.UtdanningsprogramvariantNavn === variantName)
    programVariantNavn.forEach(fagbrev =>  {
        fagbrevList.push((fagbrev.ProgramomraadeNavn).split(' - ')[1])
    });
    return fagbrevList    
}
