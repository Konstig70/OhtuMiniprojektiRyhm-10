import { useState } from 'react'
//Konsta 28.11 geFields nyt siirretty omaan tiedostoon ja importti sille
import { getFields } from './funkkarit/fields'

function InputKentat({nimiLista, muokattava}) {
  // Poistutaan, jos kenttien nimiä ei annettu
  if (!nimiLista) {
    return
  }
//	console.log(nimiLista);
  if (muokattava === undefined) muokattava = {};
  // Luodaan listaan inputit kaikille kentille
  const InputFields = () => {
    return (
      nimiLista.map(name =>
        <div  className='inputContainer' key={name}>
          <label>{name + ": "}
            <input type="text" className='hakuKentta' name={name}
	      defaultValue={muokattava[name] !== undefined ? muokattava[name] : ""}/>
          </label>
        </div>
    )
    )}

  // Palautetaan input-kentät
  return (
    <InputFields />
  )
}


function Lomake({muokattava}) {
  // Objekti, jossa on viitetyyppi ja lista kenttien nimistä.
  // Oletustyyppi määrää selectiin "Valitse tyyppi"-optionin.
  // Oletuksena kenttälista on tyhjä
  const [nameList, setNameList] = useState({"tyyppi": "oletus", "lista": []})

  if (muokattava !== undefined && muokattava["type"] !== undefined &&
	  nameList.tyyppi != muokattava["type"]) {
      getFields(muokattava["type"], setNameList);
  }
  
  const handleChange = (e) => {
    // Dropdown valikosta valittu viitetyyppi muutettuna pieneksi ja tyhjät merkit poistettuna, jotta haku toimii
    let valittu = e.target.value.toLowerCase().replaceAll(/\s/g,'')
    // Haetaan kentät ja asetetaan listaan, jolloin react tekee taikoja ja kentät tulee näyttöön
    getFields(valittu, setNameList)
  }

  return (
    <>
      <form>
        <legend>Valitse viitetyyppi</legend>
        <label>Viitetyypi:
          <select id='tyyppiValinta' onChange={handleChange} value={nameList["tyyppi"]}>
            <option value="oletus" disabled selected hidden>Valitse tyyppi</option>
            <option value="article">Article</option>
            <option value="book">Book</option>
            <option value="booklet">Booklet</option>
            <option value="conference">Conference</option>
            <option value="inbook">Inbook</option>
            <option value="incollection">Incollection</option>
            <option value="inproceedings">Inproceedings</option>
            <option value="manual">Manual</option>
            <option value="mastersthesis">Masters thesis</option>
            <option value="phdthesis">Phd thesis</option>
            <option value="proceedings">Proceedings</option>
            <option value="techreport">Techreport</option>
            <option value="unpublished">Unpublished</option>
            <option value="misc">Misc</option>
          </select>
        </label>
      </form>
      <InputKentat nimiLista={nameList["lista"]} muokattava={muokattava} />
    </>
  )
}

export default Lomake
