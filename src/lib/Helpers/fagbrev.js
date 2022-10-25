import fagbrev from '../../assets/fagbrevUDIR.json'

export function getFagbrev (variantName) {
  const fagbrevList = []
  const programVariantNavn = fagbrev.filter(programName => programName.UtdanningsprogramvariantNavn === variantName)
  programVariantNavn.forEach(fagbrev => {
    fagbrevList.push((fagbrev.ProgramomraadeNavn).split(' - ')[1])
  })
  return fagbrevList
}
