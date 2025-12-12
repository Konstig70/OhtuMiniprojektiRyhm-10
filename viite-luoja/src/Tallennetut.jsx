import { JsonToBibtex } from './funkkarit/jsonToBibtex.jsx';

//Ottaa kaikki tallennetut viitteet ja luo kentän missä viitteet näkyy.
//Myöhemmin tuodaan tiedostosta kaikki tallennetut viitteet mutta alustavasti käytetään esimerkkidataa
function Tallennetut({viitteet}) {

    const KaikkiViitteet = () => {
        return(
      <ul id="viitelistaus">
      {viitteet.map(item => <li key={item["citekey"]}><JsonToBibtex jsonObject={item}/></li>)}
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
