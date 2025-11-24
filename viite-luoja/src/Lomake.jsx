import { useState } from 'react'
import sendToBackEnd from './App.jsx'

function Lomake() {
  return (
    <>
      <h1>Viitteiden latoja</h1>
      <form>
        <legend>Valitse viitetyyppi</legend>
        <label>Viitetyypi:
          {/*selectiin esim onChange={handleChange} kun frontendistä tulee eri inputit*/}
          <select>
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
        <button type="radio" onClick={sendToBackEnd}>Lähetä</button>
      </form>
    </>
  )
}

export default Lomake
