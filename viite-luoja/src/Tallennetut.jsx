//import { JsonToBibtex } from './funkkarit/jsonToBibtex.jsx';

import { useState } from "react";

//Ottaa kaikki tallennetut viitteet ja luo kentän missä viitteet näkyy.
//Myöhemmin tuodaan tiedostosta kaikki tallennetut viitteet mutta alustavasti käytetään esimerkkidataa
function Tallennetut({viitteet, poistaViite, tiedotLomakkeelle}) {

    const [state, setState] = useState(viitteet);
    // Poisto vaikuttaa tällä hetkellä vain tähän listaukseen
    const KaikkiViitteet = () => {
        return(
      <ul id="viitelistaus">
      {state.map(item => <li key={item["citekey"]}>
	      <button onClick={() => poistaViite(item)}> x </button>
	      <a onClick={() => tiedotLomakkeelle(item)}>{item["citekey"]}</a>
	      <ul>{Object.keys(item).map(key => item[key] != "" && key != "citekey" ?
		      <li key={key}>{key + ": " + item[key]}</li> : "")}
	      </ul></li>)}
      </ul>
    );
    }

    return (
        <div className='tallennetutContainer'>
          <div className="suodatusKentat">
          <legend>Suodata: </legend>
          <label>Author
          <input type="text" name="author" onChange={() => suodata(viitteet, setState, state)} /> </label>
          <label>Year 
          <input type="text" name="year" onChange={() => suodata(viitteet, setState, state)} /> </label>
          </div>
          <div className="tallennetutViitteet">
           <legend>Tallennetut viitteet</legend>
           <KaikkiViitteet/>
          </div> 
        </div>
    )
}

function suodata(viitteet, setState, state) {
  let author = document.getElementsByName("author")[0].value;
  let year = document.getElementsByName("year")[0].value;
  if (author.trim().length === 0 && year.trim().length === 0) {
    setState(viitteet);
  }
  console.log("kaikki:",viitteet); 
  console.log("Author", state.map(e => e.author));
  const data = viitteet.filter(e => {
    if (!year) {
      return e.author.toLowerCase().startsWith(author);
    }
    if (!author) {
      return e.year.startsWith(year);
    }
    return e.author.toLowerCase().startsWith(author) && e.year.startsWith(year);

  });
  console.log("Suodatetut", data);
  setState(data);

}

export default Tallennetut
