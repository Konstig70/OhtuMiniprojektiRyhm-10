import { useEffect, useState } from 'react'
import './App.css'
import Lomake from './Lomake.jsx'
import Devnapit from './Devnapit.jsx' // lisätty palvelimen testaamista varten pohja/Micke 25.11.
import Esikatselu from './Esikatselu.jsx';
import Listaus from './Listaus.jsx';
import Tallennetut from './Tallennetut.jsx';
import { poistaViite } from './funkkarit/poisto.js';
import { muokkaaViite } from './funkkarit/muokkaus.js';
import checkRequired from './funkkarit/checkRequired.js';
import { Doihakulomake } from './doihakulomake.jsx'

// muokattu 14.12.2025/Micke lisätty DOI-hakutuloksen tallennus

function tarkistaPakolliset() {
  //Haetaan inputit
  let inputit = document.getElementsByClassName("hakuKentta");
  //Haetaan inputeista arvot ja laitetaan taulukkoon
  const arvot = Array.from(inputit).map((i) => i.value);
  //console.log(arvot);

  // Haetaan valittu viitetyyppi
  const tyyppi = document.getElementById("tyyppiValinta").value.toLowerCase()

  // Tarkistaa, onko kaikki pakolliset kentät täytetty
  let check = checkRequired(arvot, tyyppi)
  let teksti = document.getElementById("virhe")
  if (!check) { 
    // Jos virheellinen tyyppi, palautetaan false
    return false;
  } else if (typeof check == "string") {
    let kentta = document.getElementsByName(check).item(0)
    let lisaysNappi = document.getElementById("viitteenLisays")
    // Jos ruudulla ei ole varoitustekstiä, luodaan sellainen ja laitetaan lisäysnapin alle
    if (!teksti) {
      teksti = document.createElement("p")
      teksti.id = "virhe"
      teksti.innerHTML = `Pakollinen kenttä ${check} täyttämättä`
      lisaysNappi.insertAdjacentElement("afterend", teksti)
    } else {
      // Jos ruudulla on jo varoitusteksti, poistetaan se ja luodaan uusi tilalle
      teksti.remove()
      teksti.innerHTML = `Pakollinen kenttä ${check} täyttämättä`
      lisaysNappi.insertAdjacentElement("afterend", teksti)
    }
    // Asetetaan fokus ensimmäiseen puuttuvaan pakolliseen kenttään ja palautetaan false
    kentta.focus()
    return false;
  }

  // Poistaa olemassaolevan varoituksen, jos lisäys onnistuu
  if (teksti) teksti.remove()
  return true
}

//Konsta 28.11: Hakee inputtien tiedot ja muodostaa niistä bibtex muotoisen viitteen
//Tätä funktioo voi myös jatkaa ja lisätä sen kentälle lisäämisen myös tähän
function lisaaViite(setViitteet, viitteet, setMuokattava, muokattava, setData, data, setKaikki) {
  
  // Poistutaan, jos pakollisia viitteitä ei täytetty
  if (!tarkistaPakolliset()) return

  //kutsutaan funktiota joka joko muokkaa viitettä tai lisää sen uutena
  muokkaaViite(true, setViitteet, viitteet, setMuokattava, muokattava, setData, data, setKaikki);


  //Sitten vaan kutsukaa bibtex muotoon muuttamis funkkarii tolla arvot muuttujal 
}

//viite tallennetaan mutta ei lisätä esikatseluun
function tallennaViite(setViitteet, viitteet, setMuokattava, muokattava, setData, data, setKaikki) {
  
  // Poistutaan, jos pakollisia viitteitä ei täytetty
  if (!tarkistaPakolliset()) return

  
  //kutsutaan funktiota joka joko muokkaa viitettä tai lisää sen uutena
  muokkaaViite(false, setViitteet, viitteet, setMuokattava, muokattava, setData, data, setKaikki);
}

// Asettaa muokattavan viitteen tiedot. Lomake-komponentti hoitaa loput
function tiedotLomakkeelle(setMuokattava, muokattava) {
  setMuokattava(muokattava);
}

async function haeTietokannasta() {
  const API_KEY = import.meta.env.VITE_API_AVAIN;
  const url = "https://ohtuminiprojektiryhm-10-backend.onrender.com/tietokanta/lue";
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {"API-Avain": API_KEY},
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);
    return null;
  }

}

function App() {

  //tila viitteille
  //lisätyt viitteet json-muodossa
  const [viitteet, setViitteet] = useState([]);

  const [muokattava, setMuokattava] = useState({});
  const [lataa, setLataa] = useState(true);
  const [data, setData] = useState(null);
  //Konsta 15.12 Pitää sisällään kaikki viitteet, ns master data
  //Tätä annetaan nyt lisäys, muokkaus ja poisto funktioihin. Tarvitaan, jotta näytettävät viitteet suodattuu oikein ilman, että menetetään viitteittä.
  const [kaikki, setKaikki] = useState([]);
  useEffect(() => {
    //Huijataan eli laitetaan useEffect sisälle async funktio, koska itse react funktio ei voi olla async 
    async function lataa() { 
      //Laitetaan Data ja poistetaan lataus  
      const tiedot = await haeTietokannasta();
      setData(tiedot);
      setKaikki(tiedot);
      setLataa(false);
    }
    lataa();
  }, []);
  //Palautetaan väliaikainen viesti jos ladataan 
  if (lataa) {
    return ( <p>Loading...</p>)
  }
  return (
    <>
        <h1> Tervetuloa! </h1>
    <div className='appContainer'>
      <div className='lomakeJaEsikatselu'>
        
      
      <div className='lomake'>
        <Lomake muokattava={muokattava} />
        <button onClick={() => tallennaViite(setViitteet, viitteet, setMuokattava, muokattava, setData, data, setKaikki)} id='viitteenTallennus'>Tallenna</button> 
        <button onClick={() => lisaaViite(setViitteet, viitteet, setMuokattava, muokattava, setData, data, setKaikki)} id='viitteenLisays'>Lisää viite</button>
        <Doihakulomake tallennusfunktio={(metadata) => muokkaaViite(false, setViitteet, viitteet, setMuokattava, muokattava, setData, data, setKaikki, metadata)}/>
        </div>
        <div className='esikatseluContainer'>
          <Esikatselu viitteet={viitteet} />{/*Viedään taulukko viitteistä, kunhan siltä osin valmista*/}
          <Listaus viitteet={viitteet}
            poistaViite={(poistettava) => poistaViite(viitteet, setViitteet, poistettava)}
            tiedotLomakkeelle={(muokattava) => tiedotLomakkeelle(setMuokattava, muokattava)} />
        </div>
        </div>
        <Tallennetut viitteet={data}
	  poistaFunktio={(poistettava) => poistaViite(data, setData, poistettava, null, setKaikki)}
	  tiedotLomakkeelle={(muokattava) => tiedotLomakkeelle(setMuokattava, muokattava)}
    kaikkiViitteet={kaikki}
    setState={setData}/>
      </div>
      <Devnapit />
    </>
  )
}

export default App
