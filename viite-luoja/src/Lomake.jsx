import { useState } from 'react'
//Konsta 28.11 geFields nyt siirretty omaan tiedostoon ja importti sille
import { getFields } from './funkkarit/fields'

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
