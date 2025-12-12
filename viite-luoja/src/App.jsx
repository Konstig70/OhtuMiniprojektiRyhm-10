import { useEffect, useState } from 'react'
import './App.css'
import Lomake from './Lomake.jsx'
import Devnapit from './Devnapit.jsx' // lisätty palvelimen testaamista varten pohja/Micke 25.11.
import Esikatselu from './Esikatselu.jsx';
import Listaus from './Listaus.jsx';
import Tallennetut from './Tallennetut.jsx';
import { poistaViite } from './funkkarit/poisto.js';
import { muokkaaViite } from './funkkarit/muokkaus.js';
import esimerkkidata from "./esimerkkidata.json" with { type: "json" };
import checkRequired from './funkkarit/checkRequired.js';
import { Doihakulomake } from './doihakulomake.jsx'


//Konsta 28.11: Hakee inputtien tiedot ja muodostaa niistä bibtex muotoisen viitteen
//Tätä funktioo voi myös jatkaa ja lisätä sen kentälle lisäämisen myös tähän
function lisaaViite(setViitteet, viitteet, setMuokattava, muokattava, setData, data) {
  //Haetaan inputit
  let inputit = document.getElementsByClassName("hakuKentta");
  //Haetaan inputeista arvot ja laitetaan taulukkoon
  const arvot = Array.from(inputit).map((i) => i.value);
  //console.log(arvot);

  // Haetaan valittu viitetyyppi
  const tyyppi = document.getElementById("tyyppiValinta").value.toLowerCase()

  // Tarkistaa, onko kaikki pakolliset kentät täytetty
  let check = checkRequired(arvot, tyyppi)
  if (!check) {
    return;
  } else if (typeof check == "string") {
    let kentta = document.getElementsByName(check).item(0)
    console.log(kentta)
    let teksti = document.createElement("p")
    teksti.id = "virhe"
    teksti.innerHTML = `Pakollinen kenttä ${check} täyttämättä`
    kentta.insertAdjacentElement("afterend", teksti)
    kentta.focus()
    //setVirhe(`Pakollinen kenttä ${check} täyttämättä`)
    return;
  }

  //kutsutaan funktiota joka joko muokkaa viitettä tai lisää sen uutena
  muokkaaViite(true, setViitteet, viitteet, setMuokattava, muokattava, setData, data);


  //Sitten vaan kutsukaa bibtex muotoon muuttamis funkkarii tolla arvot muuttujal 
}

//viite tallennetaan mutta ei lisätä esikatseluun
function tallennaViite(setViitteet, viitteet, setMuokattava, muokattava, setData, data) {
  //kutsutaan funktiota joka joko muokkaa viitettä tai lisää sen uutena
  //

  muokkaaViite(false, setViitteet, viitteet, setMuokattava, muokattava, setData, data);
}

// Asettaa muokattavan viitteen tiedot. Lomake-komponentti hoitaa loput
function tiedotLomakkeelle(setMuokattava, muokattava) {
  setMuokattava(muokattava);
  // Täällä varmaan kutsutaan tallennusfunktiota
}

async function haeTietokannasta() {
  const url = "https://ohtuminiprojektiryhm-10-backend.onrender.com/tietokanta/lue";
  try {
    const response = await fetch(url);
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
   
  useEffect(() => {
    //Huijataan eli laitetaan useEffect sisälle async funktio, koska itse react funktio ei voi olla async 
    async function lataa() { 
      //Laitetaan Data ja poistetaan lataus  
      setData(await haeTietokannasta());
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
    <div className='appContainer'>
      <div className='lomake'>
        <Lomake muokattava={muokattava} />
        <button onClick={() => tallennaViite(setViitteet, viitteet, setMuokattava, muokattava, setData, data)}>Tallenna</button>
        <button onClick={() => lisaaViite(setViitteet, viitteet, setMuokattava, muokattava, setData, data)} id='viitteenLisays'>Lisää viite</button>
        <p id="virhe"></p>
        <Doihakulomake />
        </div>
        <div className='esikatseluContainer'>
          <Esikatselu viitteet={viitteet} />{/*Viedään taulukko viitteistä, kunhan siltä osin valmista*/}
          <Listaus viitteet={viitteet}
            poistaViite={(poistettava) => poistaViite(viitteet, setViitteet, poistettava)}
            tiedotLomakkeelle={(muokattava) => tiedotLomakkeelle(setMuokattava, muokattava)} />
        </div>
        <Tallennetut viitteet={data} />
      </div>
      <Devnapit />
    </>
  )
}

export default App
