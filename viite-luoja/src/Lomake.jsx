import { useState } from 'react'
import sendToBackEnd from './App.jsx'

function InputKentat({nimiLista}) {
  // Poistutaan, jos kenttien nimiä ei annettu
  if (!nimiLista) {
    return
  }

  // Luodaan listaan inputit kaikille kentille
  const InputFields = () => {
    return (
      nimiLista.map(name =>
        <div  className='inputContainer' key={name}>
          <label>{name + ": "}
            <input type="text" className='hakuKentta' />
          </label>
        </div>
    )
    )}

  // Palautetaan input-kentät
  return (
    <InputFields />
  )
}

// Muokattu sendToBackEnd-funktio. Ilmeisesti oli tarkoitus muokata kyseistä funktiota ja kaikki backend kutsut
// lähettää sen kautta, mutta en viitsinyt itsekseni alkaa muokkaamaan ettei mene rikki.
// Kun sendToBackEnd on muokattu lopulliseen muotoon, tän voi kai poistaa
async function getFields(viitetyyppi, setNameList) {
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
      
      // Otetaan vastauksena saadut kentät ja asetetaan ne listaan
      let result = await response.json();
      setNameList(result["fields"])
      
    } catch (error) {
      console.error(error);
      return null
    }
}

function Lomake() {
  // Lista kenttien nimistä. Oletuksena valittuna viitetyypin article kentät
  const [nameList, setNameList] = useState( [ "author", "title", "year", "journal", "volume", "number", "pages", "doi" ] )

  // Tekee pyynnön aina bäckendiin, kun valitsee eri viitetyypin, mikä on ehkä huono
  const handleChange = (e) => {
    // Dropdown valikosta valittu viitetyyppi muutettuna pieneksi ja tyhjät merkit poistettuna, jotta haku toimii
    let valittu = e.target.value.toLowerCase().replaceAll(/\s/g,'')

    // Haetaan kentät ja asetetaan listaan, jolloin react tekee taikoja ja kentät tulee näyttöön
    getFields(valittu, setNameList)
  }

  return (
    <>
      <h1>Viitteiden latoja</h1>
      <form>
        <legend>Valitse viitetyyppi</legend>
        <label>Viitetyypi:
          <select onChange={handleChange}>
            <option>Article</option>
            <option>Book</option>
            <option>Booklet</option>
            <option>Conference</option>
            <option>Inbook</option>
            <option>Incollection</option>
            <option>Inproceedings</option>
            <option>Manual</option>
            <option>Masters thesis</option>
            <option>Phd thesis</option>
            <option>Proceedings</option>
            <option>Techreport</option>
            <option>Unpublished</option>
            <option>Misc</option>
          </select>
        </label>
      </form>
      <InputKentat nimiLista={nameList} />
    </>
  )
}

export default Lomake
