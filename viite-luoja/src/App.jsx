import { useState } from 'react'
import './App.css'

async function sendToBackEnd() {
  try {
    let obj = {"nimi": "Palvelin"};
    let response = await fetch("http://127.0.0.1:3000", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
      console.log(response)
      let result = await response.text();
      console.log(result);    
      //return result;    
      
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
      <button type="radio" onClick={sendToBackEnd}>nappi, paina tästä</button>
    </>
  )
}


export default App
