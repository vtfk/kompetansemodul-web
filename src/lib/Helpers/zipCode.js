/*
  0 = Postnummer, 1 = Poststed, 2 = Kommunekode, 3 = Kommunenavn, 4 = Kategori
  Kategori:
    B = Både gateadresser og postbokser
    F = Flere bruksområder (felles)
    G = Gateadresser (og stedsadresser), dvs. “grønne postkasser”
    P = Postbokser
    S = Servicepostnummer (disse postnumrene er ikke i bruk til postadresser)
*/
import postnummer from '../../assets/postnummerBOM22.json'

export function getZipCodeInfo (zipCode) {
  const zipCodeInfo = postnummer.find(zipInfo => zipInfo.Postnummer === zipCode)
  return zipCodeInfo
}
