//import { JsonToBibtex } from './funkkarit/jsonToBibtex.jsx';
import { useState } from "react";

//Ottaa kaikki tallennetut viitteet ja luo kentän missä viitteet näkyy.
//Myöhemmin tuodaan tiedostosta kaikki tallennetut viitteet mutta alustavasti käytetään esimerkkidataa
function Tallennetut({viitteet, poistaFunktio, tiedotLomakkeelle, setState, kaikkiViitteet}) {
    
    //Suodatuksen hakusanat
    const [authorVal, setAuthVal] = useState([]);
    const [yearVal, setYearVal] = useState([]);
    
    // Poisto vaikuttaa tällä hetkellä vain tähän listaukseen
    //Ongelma tässä oli, että viitteiden suodatus oli sidottu sen omaan tilaan, joka ei muuttunut kun lisättiin, muokattiin, tms viitteitä
    const KaikkiViitteet = () => {
        return(
      <ul id="viitelistaus">
      {viitteet.map(item => <li key={item["citekey"]}>
	      <button onClick={() => poistaFunktio(item)}> x </button>
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
          <input type="text" name="author" onChange={(e) => suodata(e.target.value.toLowerCase(), setState, kaikkiViitteet, "author", yearVal, setAuthVal)} /> </label>
          <label>Year 
          <input type="text" name="year" onChange={(e) => suodata(e.target.value, setState, kaikkiViitteet, "year", authorVal, setYearVal)} /> </label>
          </div>
          <div className="tallennetutViitteet">
           <legend>Tallennetut viitteet</legend>
           <KaikkiViitteet/>
          </div> 
        </div>
    )
}

//Hoitaa suodatuksen
function suodata(hakusana, setState, kaikki, tyyppi, toineHakuSana, setHakuSana) {
  //Jos ei hakusanaa kummassakaan näytetään kaikki 
  if (hakusana.trim().length === 0 && toineHakuSana.trim().length === 0) {
    setState(kaikki);
  }
  //Debug
  console.log("hakusana: ", hakusana);
  console.log("kaikki:",kaikki); 
  console.log("Author", kaikki.map(e => e.author));
  //Suodatus 
  const suodatetut = kaikki.filter(e => {
    if (tyyppi === "author") { //Jos täytetty author kenttään
      setHakuSana(hakusana);
      //Eli hakusana oli author kenttä ja toineHakuSana eli siis year kenttä
      return e.author.toLowerCase().startsWith(hakusana) && e.year.startsWith(toineHakuSana);
    }
    else {
      setHakuSana(hakusana);
      //Tässä sama, mutta toistepäin
      return e.year.startsWith(hakusana) && e.author.toLowerCase().startsWith(toineHakuSana);
    }

  });
  console.log("Suodatetut", suodatetut);
  //Päivitetään tilaa, mutta EI päivitetä master dataa eli setKaikki
  setState(suodatetut);

}

export default Tallennetut
