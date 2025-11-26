// pohja erilaisille palvelimen testauksille,
// jotta ei tarvitse koskea App.jsx-tiedostoon
// 25.11.2025 Micke

// NÄYTETÄÄNKÖ NAPIT VAI EI
const naytaDevNapit = false;

  
async function HaeViitetyypit() {

  try {   
    
    let response = await fetch("http://127.0.0.1:3000/viitetyypit", {
      method: "GET",      
      headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
      
      // Otetaan vastauksena saadut kentät ja asetetaan ne listaan
      let result = await response.json();            
      tulostaTyypit(result);      
      
    } catch (error) {
      console.error(error);
      return null
    }
    
}


function tulostaTyypit(viitetyypit) {

    if (viitetyypit != null) {           
        console.log(viitetyypit["viitetyypit"]);                                     
    }

}


export function Devnapit() {
      
  if (naytaDevNapit) {   
      
    return (
        <button onClick={HaeViitetyypit}>DEV: tulosta kaikki viitetyypit konsoliin</button>
    )
  
  }
  
}

export default Devnapit
