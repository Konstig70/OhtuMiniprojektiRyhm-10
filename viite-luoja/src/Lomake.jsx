import { useState } from 'react'
import sendToBackEnd from './App.jsx'

function InputKentat({nimiLista}) {
  if (!nimiLista) {
    return
  }

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

  return (
    <div>
      <InputFields />
    </div>
  )
}

async function getFields(viitetyyppi, funk) {
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
      
      let result = await response.json();
      funk(result["fields"])
      console.log(result["fields"]); // debug    
      
    } catch (error) {
      console.error(error);
      return null
    }
}

function Lomake() {
  const [nameList, setNameList] = useState( [ "author", "title", "year", "journal", "volume", "number", "pages", "doi" ] )

  // Tekee pyynnön aina bäckendiin, kun valitsee eri viitetyypin, mikä on ehkä huono
  const handleChange = (e) => {
    let valittu = e.target.value.toLowerCase()
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
