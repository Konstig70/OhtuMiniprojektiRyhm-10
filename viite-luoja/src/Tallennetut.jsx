//import { JsonToBibtex } from './funkkarit/jsonToBibtex.jsx';

//Ottaa kaikki tallennetut viitteet ja luo kentän missä viitteet näkyy.
//Myöhemmin tuodaan tiedostosta kaikki tallennetut viitteet mutta alustavasti käytetään esimerkkidataa
function Tallennetut({viitteet, poistaViite, tiedotLomakkeelle}) {

    // Poisto vaikuttaa tällä hetkellä vain tähän listaukseen
    const KaikkiViitteet = () => {
        return(
      <ul id="viitelistaus">
      {viitteet.map(item => <li key={item["citekey"]}>
	      <button onClick={() => poistaViite(item)}> x </button>
	      <a onClick={() => tiedotLomakkeelle(item)}>{item["citekey"]}</a>
	      <ul>{Object.keys(item).map(key => item[key] != "" && key != "citekey" ?
		      <li key={key}>{key + ": " + item[key]}</li> : "")}
	      </ul></li>)}
      </ul>
    );
    }

    return (
        <div className='tallennetutViitteet'>
            <legend>Tallennetut viitteet</legend>
           <KaikkiViitteet/>
        </div>
    )
}

export default Tallennetut
