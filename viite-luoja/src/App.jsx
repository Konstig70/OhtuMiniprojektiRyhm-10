import { useState } from 'react'
import './App.css'
import Lomake from './Lomake.jsx'
import Devnapit from './Devnapit.jsx' // lisätty palvelimen testaamista varten pohja/Micke 25.11.

//Konsta 28.11: Hakee inputtien tiedot ja muodostaa niistä bibtex muotoisen viitteen
//Tätä funktioo voi myös jatkaa ja lisätä sen kentälle lisäämisen myös tähän
function lisaaViite() {
  //Haetaan inputit
  let inputit = document.getElementsByClassName("hakuKentta");
  //Haetaan inputeista arvot ja laitetaan taulukkoon
  const arvot = Array.from(inputit).map((i) => i.value);
  console.log(arvot);
  //Sitten vaan kutsukaa bibtex muotoon muuttamis funkkarii tolla arvot muuttujal 
}

function App() {
  //Muistakaa laittaa tonne sitten <Lomake /> kun se tiedosto on luotu
  //Testi nappi on bäkkäriä varten tehty 
  return (
    <>
      <Lomake />
      <Devnapit />
      <button onClick={lisaaViite}>Lisää viite</button>
    </>
  )
}


export default App
