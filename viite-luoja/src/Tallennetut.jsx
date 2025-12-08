import { JsonToBibtex } from './funkkarit/jsonToBibtex.jsx';

//Ottaa kaikki tallennetut viitteet ja luo kentän missä viitteet näkyy.
//Myöhemmin tuodaan tiedostosta kaikki tallennetut viitteet mutta alustavasti käytetään esimerkkidataa
function Tallennetut({viitteet}) {

    const KaikkiViitteet = () => {
        return(
      <ul id="viitelistaus">
      {viitteet.map(item => <li id={item["citekey"]}><JsonToBibtex key={item["citekey"]} jsonObject={item}/></li>)}
      </ul>
    );
    }

    return (
        <div>
            <legend>Tallennetut viitteet</legend>
           <KaikkiViitteet/>
        </div>
    )
}

export default Tallennetut