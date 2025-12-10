import { useState } from 'react'
import './App.css'
import Lomake from './Lomake.jsx'
import Devnapit from './Devnapit.jsx' // lisätty palvelimen testaamista varten pohja/Micke 25.11.
import Esikatselu from './Esikatselu.jsx';
import Listaus from './Listaus.jsx';
import Tallennetut from './Tallennetut.jsx';
import {poistaViite} from './funkkarit/poisto.js';
import { muokkaaViite } from './funkkarit/muokkaus.js';
import esimerkkidata from "./esimerkkidata.json" with { type: "json" };


//Konsta 28.11: Hakee inputtien tiedot ja muodostaa niistä bibtex muotoisen viitteen
//Tätä funktioo voi myös jatkaa ja lisätä sen kentälle lisäämisen myös tähän
function lisaaViite(setViitteet, viitteet, setMuokattava, muokattava, setData, data) {
  //kutsutaan funktiota joka joko muokkaa viitettä tai lisää sen uutena
  muokkaaViite(true, setViitteet, viitteet, setMuokattava, muokattava, setData, data);
  
  //Sitten vaan kutsukaa bibtex muotoon muuttamis funkkarii tolla arvot muuttujal 
}

//viite tallennetaan mutta ei lisätä esikatseluun
function tallennaViite(setViitteet, viitteet, setMuokattava, muokattava, setData, data) {
  //kutsutaan funktiota joka joko muokkaa viitettä tai lisää sen uutena
  muokkaaViite(false, setViitteet, viitteet, setMuokattava, muokattava, setData, data);
}

// Asettaa muokattavan viitteen tiedot. Lomake-komponentti hoitaa loput
function tiedotLomakkeelle(setMuokattava, muokattava) {
  setMuokattava(muokattava);
  // Täällä varmaan kutsutaan tallennusfunktiota
}

function App() {
  //Muistakaa laittaa tonne sitten <Lomake /> kun se tiedosto on luotu
  //Testi nappi on bäkkäriä varten tehty 

  //tila viitteille
  //lisätyt viitteet json-muodossa
  const [viitteet, setViitteet] = useState([]);

  const [muokattava, setMuokattava] = useState({});

  const [data, setData] = useState(Array.from(esimerkkidata));

  return (
    <>
    <div className='appContainer'>
      <div>
        <Lomake muokattava={muokattava} />
        <button onClick={() => tallennaViite(setViitteet, viitteet, setMuokattava, muokattava, setData, data)}>Tallenna</button>
        <button onClick={() => lisaaViite(setViitteet, viitteet, setMuokattava, muokattava, setData, data)} id='viitteenLisays'>Lisää viite</button>
      </div>
      <Esikatselu viitteet={viitteet} />{/*Viedään taulukko viitteistä, kunhan siltä osin valmista*/}
      <Listaus viitteet={viitteet} 
	    poistaViite={(poistettava) => poistaViite(viitteet, setViitteet, poistettava)}
	    tiedotLomakkeelle={(muokattava) => tiedotLomakkeelle(setMuokattava, muokattava)}/> 
      <Tallennetut viitteet={data}/>
    </div>
    <Devnapit />
    </>
  )
}

export default App
