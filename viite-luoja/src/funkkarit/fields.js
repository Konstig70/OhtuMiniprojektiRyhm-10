// Muokattu sendToBackEnd-funktio. Ilmeisesti oli tarkoitus muokata kyseistä funktiota ja kaikki backend kutsut
// lähettää sen kautta, mutta en viitsinyt itsekseni alkaa muokkaamaan ettei mene rikki.
// Kun sendToBackEnd on muokattu lopulliseen muotoon, tän voi kai poistaa
// Konsta 28.11 lisätty setNameList default arvo, jotta voidaan käyttää testeissä ja sovelluksessa
export async function getFields(viitetyyppi, setNameList = null) {
  try {
    let obj = {"viitetyyppi": viitetyyppi};
    let response = await fetch("http://127.0.0.1:3000/maarittelyt", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
      
      // Otetaan vastauksena saadut kentät
      let result = await response.json();
      //Jos annettiin setNameList eli siis ei ole testi kyseessä, niin käytetään sitä
      if (setNameList) {
        setNameList(result["fields"]);
        return;
      }
      return result;
    } catch (error) {
      console.error(error);
      return null
  }
  
}
