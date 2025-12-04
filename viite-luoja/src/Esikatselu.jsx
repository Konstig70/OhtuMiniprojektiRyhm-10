import { JsonToBibtex } from './funkkarit/jsonToBibtex.jsx';

// Muokattu 1.12.2025/Micke, lisätty BibTeX-datan luonti JsonToBibtex-funktiolla

// Kopioitu suoraan stack overflowsta
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

// Ottaa viitteet taulukossa ja luo esikatselukentän
// Tässä vaiheessa ei ota mitään taulukkoa, vaan käytetään valmiita arvoja
function Esikatselu({ viitteet }) {
  
  // Poistuu, jos ei ole viitteitä. Eli ei näytetä tyhjää esikatselua
  if (!viitteet || viitteet.length == 0) return;

  const Kentat = () => {
    return( 
        <ul id="esikatseluLista">
        {viitteet.map(item => <JsonToBibtex key={item["citekey"]} jsonObject={item}/>)}
        </ul>
    );
  }    

  const kopioiViitteet = () => {
    // Otetaan kaikki esikatseltavat viitteet, korvataan <br>:t rivivaihdoilla, lisätään rivivaihto jokaisen
    // viitteen jälkeen ja poistetaan html tagit
    let teksti = document.getElementById("esikatseluLista").innerHTML.replaceAll(/<br>|<\/p>/g, '\n').replaceAll(/<[^<]*>/g, '')
    console.log(teksti) // debug
    copyTextToClipboard(teksti)
  }

  return (
    <div>
      <legend id='esikatseluLegend'>Esikatselu</legend>
      <div className="esikatselu">
        <Kentat />
      </div>
      <button className="kopioi" onClick={kopioiViitteet}><img src="./viite-luoja/src/assets/copy-icon.svg" alt="🗐"/></button>
    </div>
  )
}

export default Esikatselu
