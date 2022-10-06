import { tsvParseRows } from "d3-dsv";
import axios from 'axios'
import fs from 'fs'

const file = '../../assets/Postnummerregister-UTF-8.txt'

async function getCounty(zipCode) {
  let dataArr = []
  let county
  return new Promise((resolve, reject) => {
    fs.readFile(file ,{encoding: 'utf8'}, async function(err, data) {
      if(!err) {
        dataArr = tsvParseRows(data)
        for(let i = 0; i < dataArr.length; i++) {
          if(dataArr[i][0].match(zipCode)) {
            const zipFound = dataArr[i].toString().match(/[\d\-\.]+/g).indexOf('' + zipCode) > -1
            if(zipFound === true){
              /* 
                0 = Postnummer, 1 = Poststed, 2 = Kommunekode, 3 = Kommunenavn, 4 = Kategori
                Kategori:
                  B = Både gateadresser og postbokser
                  F = Flere bruksområder (felles)
                  G = Gateadresser (og stedsadresser), dvs. “grønne postkasser”
                  P = Postbokser
                  S = Servicepostnummer (disse postnumrene er ikke i bruk til postadresser)
              */  
              county = dataArr[i][3].toLowerCase()
              county = county.charAt(0).toUpperCase() + county.slice(1)
              resolve(county)
            }
          }
        }
      } else {
        reject(err)
      }
    })
  })
}

export async function getCountyValue(zipCode) {
  const county = await getCounty(zipCode)
  return county
}