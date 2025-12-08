import { useState } from 'react'
import './App.css'
import Lomake from './Lomake.jsx'
import Devnapit from './Devnapit.jsx' // lisätty palvelimen testaamista varten pohja/Micke 25.11.
import Esikatselu from './Esikatselu.jsx';
import Listaus from './Listaus.jsx';
import Tallennetut from './Tallennetut.jsx';
import {poistaViite} from './funkkarit/poisto.js';
import data from "./esimerkkidata.json" with { type: "json" };


//Konsta 28.11: Hakee inputtien tiedot ja muodostaa niistä bibtex muotoisen viitteen
//Tätä funktioo voi myös jatkaa ja lisätä sen kentälle lisäämisen myös tähän
function lisaaViite(setViitteet) {
  //Haetaan inputit
  let inputit = document.getElementsByClassName("hakuKentta");
  //Haetaan inputeista arvot ja laitetaan taulukkoon
  //const arvot = Array.from(inputit).map((i) => i.value);
  //console.log(arvot);

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


function App() {
  //Muistakaa laittaa tonne sitten <Lomake /> kun se tiedosto on luotu
  //Testi nappi on bäkkäriä varten tehty 

  //tila viitteille
  //lisätyt viitteet json-muodossa
  const [viitteet, setViitteet] = useState([]);

  return (
    <>
    <div className='appContainer'>
      <div>
        <Lomake />
        <button onClick={() => lisaaViite(setViitteet)} id='viitteenLisays'>Lisää viite</button>
      </div>
      <Esikatselu viitteet={viitteet} />{/*Viedään taulukko viitteistä, kunhan siltä osin valmista*/}
      <Listaus viitteet={viitteet} poistaViite={(poistettava) => poistaViite(viitteet, setViitteet, poistettava)}/>
      <Tallennetut viitteet={data}/>
    </div>
    <Devnapit />
    </>
  )
}

export default App
