import {generateCitekey} from './citekey'
import {ensureUniqueCitekey} from './citekey'
export function muokkaaViite(esikatseluun, setViitteet, viitteet, setMuokattava, muokattava, setData, data, tiedot=null){

  var uusiViite;

  if (!tiedot) {
    uusiViite = haeInputeista();
  } else {
    uusiViite = tiedot;
  }
  

  //jos viite on valittu muokattavaksi tallennetaan uudet tiedot viitteisiin ja dataan citekeyn avulla
  if (muokattava != {} && muokattava.citekey != undefined) {
    uusiViite.citekey = muokattava.citekey;
    let viitteetKopio = [...viitteet];
    let dataKopio = [...data];
    let loytyi = false;
    for (let i=0; i < viitteetKopio.length; i++){
      if (viitteetKopio[i].citekey === muokattava.citekey) {
        viitteetKopio.splice(i, 1, uusiViite);
        setViitteet(viitteetKopio);
        loytyi = true;
        break;
      }
    }
    // jos muokattava viite halutaan lisätä esikatseluun, mutta
    // sitä ei löytynyt listasta, lisätään se
    // (esim. muokataan tallennettua viitettä ja painetaan Lisää viite -nappia)
    if (!loytyi && esikatseluun) {
      viitteetKopio.push(uusiViite);
      setViitteet(viitteetKopio);
    }
    for (let i=0; i < dataKopio.length; i++){
      if (dataKopio[i].citekey === muokattava.citekey){
        dataKopio.splice(i, 1, uusiViite);
        setData(dataKopio);
        break;
      }
    }
  } else {
    const citekey = generateCitekey(uusiViite);
    uusiViite.citekey = ensureUniqueCitekey(citekey, data);
    //lisätään uusi viite, jos uusi viite ei ole muokattava
    //lisätään esikatseluun jos painettu lisää viite nappia, muuten vaan tallennetaan dataan
    if (esikatseluun){
        setViitteet(prev => [...prev, uusiViite]);
    }
    setData(prev => [...prev, uusiViite]);
  }

  //12.12 Konsta: Lopuksi viedään palvelimelle muutokset:
  viePalvelimelle(uusiViite);
  //asetetaan lomake tyhjäksi
  setMuokattava({});
}

async function viePalvelimelle(data) {
  const API_KEY = import.meta.env.VITE_API_AVAIN;
  const response = await fetch("https://ohtuminiprojektiryhm-10-backend.onrender.com/tietokanta/muokkaa", {
    method: "POST",
    headers: {
      "Api-Avain": API_KEY, 
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ viite: data }),
  });
  if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    console.log("Update successfull!");
}

function haeInputeista() {
    //Haetaan inputit
  let inputit = document.getElementsByClassName("hakuKentta");

  //Jimi 2.12: Muutin tätä jonkin verran esikatseluun lisäystä varten
  //sanokaa jos on huono
  let uusiViite = {};

  for (let input of inputit) {
    uusiViite[input.name] = input.value;
  }

  //haetaan viitteen tyyppi
  let select = document.querySelector("select");
  let type = select.value.toLowerCase().replace(/\s/g, "");

  uusiViite.type = type;
  return uusiViite;

}
