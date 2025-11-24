import { useState } from 'react'
import './App.css'
import Lomake from './Lomake.jsx'

//Tätä vois periaattees vähä modaa ja sit käyttää kaikes mitä lähetetään bäkkärin 
//Periaattees lisäis parametreiks metodin (get/post) ja sitten sisällön ja palautetaan response 
//niin toimis missä vaan tilanteessa
async function sendToBackEnd() {
  try {
    //HUOM Lähettäkää AINA JSON muodossa asiat palvelimelle
    //Ja kertokaa sitten kun ootte saanut päätettyä miten tuo pyynty hoituu
    
    // viitetyyppi: book, article, inproceedings
    let obj = {"viitetyyppi": "book"};
    
    // Lähetetään pyyntö 
    // Micke: poistetaan urlin loppuosa jossain vaiheessa    
    let response = await fetch("http://127.0.0.1:3000/maarittelyt", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
      
      //Tulostetaan vain teksti (tällä hetkellä bäkkäri vastaa aina teksillä, mutta vaihtuu json myöhemmin)
      //Voiaan myös periaa lähettää aina stringi takasin ja sit JSON.parse()
      let result = await response.text();
      console.log(result);    
      //return result;
      //Tää pois tyylii kommenteist sitku halutaa palauttaa
      
    } catch (error) {
      console.error(error);
      //return "";
    }

}

function App() {
  //Muistakaa laittaa tonne sitten <Lomake /> kun se tiedosto on luotu
  //Testi nappi on bäkkäriä varten tehty 
  return (
    <>
      <h1>Viitteiden latoja</h1>
      <Lomake />
      <button type="radio" onClick={sendToBackEnd}>nappi, paina tästä</button>
    </>
  )
}


export default App
