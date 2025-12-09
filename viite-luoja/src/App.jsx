import { useState } from 'react'
import './App.css'
import Lomake from './Lomake.jsx'
import Devnapit from './Devnapit.jsx' // lisätty palvelimen testaamista varten pohja/Micke 25.11.
import Esikatselu from './Esikatselu.jsx';
import Listaus from './Listaus.jsx';
import Tallennetut from './Tallennetut.jsx';
import {poistaViite} from './funkkarit/poisto.js';
import data from "./esimerkkidata.json" with { type: "json" };
import checkRequired from './funkkarit/checkRequired.js';


//Konsta 28.11: Hakee inputtien tiedot ja muodostaa niistä bibtex muotoisen viitteen
//Tätä funktioo voi myös jatkaa ja lisätä sen kentälle lisäämisen myös tähän
function lisaaViite(setViitteet) {
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
    alert(`Pakollinen kenttä ${check} täyttämättä`)
    return;
  }

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

  //väliaikainen citekey generaatio ennen oikeata
  uusiViite.citekey = "testi" + Date.now();

  //lisätään uusi viite
  setViitteet(prev => [...prev, uusiViite]);

  //lisätään viite dataan joka näkyy tallennetut kentässä, ei tallennu tiedostoon
  data.push(uusiViite);
  
  //Sitten vaan kutsukaa bibtex muotoon muuttamis funkkarii tolla arvot muuttujal 
}

// Asettaa muokattavan viitteen tiedot. Lomake-komponentti hoitaa loput
function tiedotLomakkeelle(setMuokattava, muokattava) {
  setMuokattava(muokattava);
  // Täällä varmaan kutsutaan tallennusfunktiota
}

function App() {
  //Testi nappi on bäkkäriä varten tehty 

  //tila viitteille
  //lisätyt viitteet json-muodossa
  const [viitteet, setViitteet] = useState([]);

  const [muokattava, setMuokattava] = useState({});

  return (
    <>
    <div className='appContainer'>
      <div>
        <Lomake muokattava={muokattava} />
        <button onClick={() => lisaaViite(setViitteet)} id='viitteenLisays'>Lisää viite</button>
      </div>
      <div className='esikatseluContainer'>  
      <Esikatselu viitteet={viitteet} />{/*Viedään taulukko viitteistä, kunhan siltä osin valmista*/}
      <Listaus viitteet={viitteet} 
	  poistaViite={(poistettava) => poistaViite(viitteet, setViitteet, poistettava)}
	  tiedotLomakkeelle={(muokattava) => tiedotLomakkeelle(setMuokattava, muokattava)}/> 
      </div>
      <Tallennetut viitteet={data}/>
    </div>
    <Devnapit />
    </>
  )
}

export default App
