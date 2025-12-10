export function muokkaaViite(esikatseluun, setViitteet, viitteet, setMuokattava, muokattava, setData, data){
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
  
  //jos viite on valittu muokattavaksi tallennetaan uudet tiedot viitteisiin ja dataan citekeyn avulla
  if (muokattava != {} && muokattava.citekey != undefined) {
    uusiViite.citekey = muokattava.citekey;
    let viitteetKopio = [...viitteet];
    let dataKopio = [...data];
    for (let i=0; i < viitteetKopio.length; i++){
      if (viitteetKopio[i].citekey === muokattava.citekey) {
        viitteetKopio.splice(i, 1, uusiViite);
        setViitteet(viitteetKopio);
        break;
      }
    }
    for (let i=0; i < dataKopio.length; i++){
      if (dataKopio[i].citekey === muokattava.citekey){
        dataKopio.splice(i, 1, uusiViite);
        setData(dataKopio);
        break;
      }
    }
  } else {
    //väliaikainen citekey generaatio ennen oikeata
    uusiViite.citekey = "testi" + Date.now();
    //lisätään uusi viite, jos uusi viite ei ole muokattava
    //lisätään esikatseluun jos painettu lisää viite nappia, muuten vaan tallennetaan dataan
    if (esikatseluun){
        setViitteet(prev => [...prev, uusiViite]);
    }
    setData(prev => [...prev, uusiViite]);
  }

  //asetetaan lomake tyhjäksi
  setMuokattava({});
}