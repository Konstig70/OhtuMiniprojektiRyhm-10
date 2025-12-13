// Luetaan crossref.org -palvelusta DOI-tiedon perusteella
// julkaisun metatiedot ja palautetaan ne "bibtex-yhteensopivana"
// objektina
// 11.12.2025/Micke
// esimerkki: 
// console.log(await haeMetadata("10.3389/frvir.2024.1447288"));
// console.log(await haeMetadata("https://doi.org/10.1037/edu0000473"));

export async function haeMetadata(doitunnus) {       

    // palauttaa metatiedot objektina    
    // virhetilanteessa palauttaa vain virheilmoituksen merkkijonona
    
    if (doitunnus === undefined || typeof doitunnus !== 'string') {
        return 'Virheellinen parametri.'
    }
    
    // parametri voi olla url tai doi-tunnus: 
    // https://doi.org/10.1037/edu0000473
    // 10.1037/edu0000473
    const regex = /([0-9.]+\/\S+)/; // ei riittävä, mutta kelpaa
    const doiMatch = doitunnus.match(regex);                       
    
    if (doiMatch === null) {
        return `Tarkista DOI-tunnus: ${doitunnus}`;
    }
    
    const hakuehto = doiMatch[0];

    const hakufunktio = async () => {
       
        try{        
                          
            // https://api.crossref.org/works/doi/10.1128/mbio.01735-25
            const apiurl = `https://api.crossref.org/works/doi/${hakuehto}`;            
            return await fetch(apiurl);                                          
                        
        }
        catch {
            return 'Tuntematon virhe, palvelu ei vastaa?';
        }
    
    }
    
    return kasitteleHaetutMetatiedot(hakufunktio);
    
}


export async function kasitteleHaetutMetatiedot(hakufunktio) {

    // hakufunktio annetaan parametrissa, jotta voidaan testata virhetilanteet 

    if (hakufunktio === undefined || typeof hakufunktio !== 'function') {
        return 'Ohjelmassa on virhe.';    
    }

    const response = await hakufunktio();    
           
    // nämä ovat tässä hakufunktion sijaan jotta voidaan
    // testata palvelimen virhetilanteet (yksinkertaisesti)
    if (typeof response == 'string') {
        return response;
    }        
    else if (response.status == 404) {
        return 'Metatietoja ei löytynyt.';
    }
    else if (response.status != 200) {
        return `Palvelu antoi virheviestin: ${response.status} ${response.statusText}.`;
    }                                
    
    let data = await response.json();
    
    return lueKentat(data.message);        

}


export function lueKentat(jsonData) { 
      
    // luetaan verkkopalvelusta saadusta datasta halutut kentät
    // palautetaan objekti
    
    // lisätään citekey:
    // ensimmäinen kirjoittaja + julkaisuvuosi, tai
    // ensimmäinen editor + julkaisuvuosi, tai
    // muokattu doi-tunnus
    
    try {
    
        const kenttamuunnokset = {
            'address': null,
            'annote': null,
            'author': () => lueNimet(jsonData, 'author'),
            'booktitle': () => lueTaulukosta(jsonData, 'title', 0),
            'chapter': null,
            'edition': null,
            'editor': () => lueNimet(jsonData, 'editor'),
            'howpublished': null,
            'institution': null,
            'journal': () => lueTaulukosta(jsonData, 'container-title', 0), 
            'month': () => luePaivaysTaulukko(jsonData, 'published')[1],
            'note': null,
            'number': 'issue',
            'organization': null, 
            'pages': 'page', 
            'publisher': 'publisher', 
            'school': null, 
            'series': () => lueTaulukosta(jsonData, 'container-title', 0),
            'title': () => lueTaulukosta(jsonData, 'title', 0),
            'type': () => lueViitetyyppi(jsonData, 'type'), 
            'volume': 'volume',
            'year': () => luePaivaysTaulukko(jsonData, 'published')[0],
            'doi': 'DOI', 
            'issn': null, 
            'isbn': null, 
            'url': 'URL'
        }
       
        let luettuData = {};
        
        Object.keys(kenttamuunnokset).forEach(avain => {
        
            switch (typeof kenttamuunnokset[avain]) {
                case 'object':
                    // null, ei osata lukea 
                    break;
                case 'function':
                    // ei lisätä tyhjiä kenttiä
                    {
                        const arvo = kenttamuunnokset[avain]();
                        if (arvo.length > 0) {
                            luettuData[avain] = arvo;
                        }
                    }
                    break;
                default:
                    // luetaan kenttä
                    if (Object.prototype.hasOwnProperty.call(jsonData, kenttamuunnokset[avain])) {
                        luettuData[avain] = jsonData[kenttamuunnokset[avain]];
                    }
                    break;
            }
                
        });            
               
        const citekey = luoCitekey(luettuData);
        
        if (citekey.length > 0) {
            luettuData.citekey = citekey;
        }
        
        if (Object.keys(luettuData).length == 0) {
            return 'Metatietojen muunnoksessa tuli virhe.';
        }
        
        return luettuData;
    
    }
    catch {
        return 'Metatietojen muunnoksessa tuli virhe.';
    }
    
}


export function luoCitekey(jsonData) {

    if (typeof jsonData !== 'object') {
        return '';
    }
    
    const pilkunIndeksiAuthor = Object.prototype.hasOwnProperty.call(jsonData, 'author') ? jsonData.author.indexOf(',') : -1;        
    const pilkunIndeksiEditor = Object.prototype.hasOwnProperty.call(jsonData, 'editor') ? jsonData.editor.indexOf(',') : -1;        
    const julkaisuvuosi = Object.prototype.hasOwnProperty.call(jsonData, 'year') ? jsonData.year : '';  
    const doi = Object.prototype.hasOwnProperty.call(jsonData, 'doi') ? jsonData.doi : ''; 
    
    if (pilkunIndeksiAuthor >= 0 && julkaisuvuosi.length > 0) {
        return jsonData.author.slice(0, pilkunIndeksiAuthor) + julkaisuvuosi;
    }
    else if (pilkunIndeksiEditor >= 0 && julkaisuvuosi.length > 0) {
        return jsonData.editor.slice(0, pilkunIndeksiEditor) + julkaisuvuosi;
    }
    else if (doi.length > 0) {
        // hätäratkaisuna muodostetaan citekey DOI-tunnuksesta
        return doi.replaceAll(/[^a-zA-Z0-9]/g, '');            
    }
    
    return '';

}


export function lueViitetyyppi(jsonData, avain) {
    
    // muunnetaan crossref.org-palvelun käyttämä viitetyyppi bibtex-muotoon
    
    // aika moni on laitettu tyypiksi 'misc', koska on vaikea arvailla
    // mikä bibtex-tyyppi olisi sopiva ilman laajempaa otosta...                     
    
    if (typeof jsonData !== 'object' || 
        typeof avain !== 'string' ||
        !Object.prototype.hasOwnProperty.call(jsonData, avain)) {
        return '';
    }
    
    const tyyppimuunnokset = {
      'book-section': 'inbook',
      'monograph': 'misc',
      'report-component': 'report',
      'report': 'report',
      'peer-review': 'misc',
      'book-track': 'book',
      'journal-article': 'article',
      'book-part': 'inbook',
      'other': 'misc',
      'book': 'book',
      'journal-volume': 'incollection',
      'book-set': 'book',
      'reference-entry': 'misc',
      'proceedings-article': 'inproceedings',
      'journal': 'incollection',
      'component': 'misc',
      'book-chapter': 'inbook',
      'proceedings-series': 'proceedings',
      'report-series': 'misc',
      'proceedings': 'proceedings',
      'database': 'misc',
      'standard': 'misc',
      'reference-book': 'book',
      'posted-content': 'misc',
      'journal-issue': 'incollection',
      'dissertation': 'phdthesis',
      'grant': 'misc',
      'dataset': 'misc',
      'book-series': 'incollection',
      'edited-book': 'book'
    };      
      
    const viitetyyppi = jsonData[avain];

    if (Object.prototype.hasOwnProperty.call(tyyppimuunnokset, viitetyyppi)) {             
         return tyyppimuunnokset[viitetyyppi];                
    }
    else {
        return 'misc';
    }

}    


export function lueNimet(jsonData, avain) { 

    // muodostetaan kirjoittajien (tai kustannustoimittajien, editor)
    // nimistä merkkijono: sukunimi, etunimi, etunimi sukunimi and etunimi sukunimi
    // eli jokseenkin Chigago-tyyliin
               
    if (typeof jsonData !== 'object' || 
        typeof avain !== 'string' ||
        !Object.prototype.hasOwnProperty.call(jsonData, avain) ||
        typeof jsonData[avain] !== 'object') { 
        return '';
    }               
    
    //[{ given: 'Jocelyn', family: 'Parong' }]
    let kirjoittajat = jsonData[avain].map((item, index) => {
        if (index == 0) {
            return `${item.family}, ${item.given}`;
        }            
        else {
            return `${item.given} ${item.family}`;
        }        
    });        
            
    switch (kirjoittajat.length) {
      case 0:
        return '';            
      case 1:
        return kirjoittajat[0];      
      default:        
        return kirjoittajat.slice(0, kirjoittajat.length - 1).join(', ') + ' and ' + kirjoittajat[kirjoittajat.length - 1];  
    }                        
               
}


export function lueTaulukosta(jsonData, avain, indeksi) {

    // oletetaan että avaimen avulla luettava kenttä on taulukko,
    // josta luetaan indeksin osoittama arvo

    if (typeof jsonData !== 'object' || 
        typeof avain !== 'string' ||
        typeof indeksi !== 'number' ||
        !Object.prototype.hasOwnProperty.call(jsonData, avain) ||
        typeof jsonData[avain] !== 'object') { 
        return '';
    }      
    
    if (indeksi < 0 || jsonData[avain].length < indeksi + 1) {        
        return '';
    }
    
    return jsonData[avain][indeksi].toString();

}


export function luePaivaysTaulukko(jsonData, avain) {

    // oletetaan että avaimen avulla luettava kenttä on objekti,
    // jolla on avain 'date-parts', joka on myös taulukko     
    // palautetaan aina taulukko jossa on kolme merkkijonoa: ['vv', 'kk', 'pp']
    // (osa tai kaikki voi olla tyhjiä merkkijonoja)
  
    // published: { 'date-parts': [ [2025, 12, 24] ] } kuukausi ja päivä voi puuttua!
    if (typeof jsonData !== 'object' || 
        typeof avain !== 'string' ||        
        !Object.prototype.hasOwnProperty.call(jsonData, avain) ||
        !Object.prototype.hasOwnProperty.call(jsonData[avain], 'date-parts') ||
        typeof jsonData[avain]['date-parts'] !== 'object' ||
        jsonData[avain]['date-parts'].length == 0 ||
        jsonData[avain]['date-parts'][0].length == 0 ) { 
        return ['', '', ''];
    }    
     
    return jsonData[avain]['date-parts'][0].map(arvo => arvo.toString()).concat(['', '', '']).slice(0, 3);

}


