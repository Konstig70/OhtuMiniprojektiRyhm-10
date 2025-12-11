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


async function kasitteleHaetutMetatiedot(hakufunktio) {

    // hakufunktio annetaan parametrissa, jotta voidaan testata virhetilanteet 

    if (hakufunktio === undefined || typeof hakufunktio !== 'function') {
        return 'Ohjelmassa on virhe.';    
    }

    const response = await hakufunktio();
    
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


function lueKentat(jsonData) { 

    // luetaan verkkopalvelusta saadusta datasta halutut kentät
    // palautetaan objekti
    
    // lisätään citekey jos kirjoittajien nimet ja julkaisuvuosi löytyy
       
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
        'type': () => muunnaViitetyyppi(jsonData.type), 
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
                luettuData[avain] = kenttamuunnokset[avain]();
                break;
            default:
                // luetaan kenttä
                if (Object.prototype.hasOwnProperty.call(jsonData, kenttamuunnokset[avain])) {
                    luettuData[avain] = jsonData[kenttamuunnokset[avain]];
                }
                break;
        }
            
    });
        
    const pilkunIndeksi = luettuData.author.indexOf(',');        
    const julkaisuvuosi = luettuData.year;
    
    if (pilkunIndeksi >= 0 && julkaisuvuosi.length > 0) {
        luettuData.citekey = luettuData.author.slice(0, pilkunIndeksi) + julkaisuvuosi;
    }
    
    return luettuData;
    
}


function muunnaViitetyyppi(viitetyyppi) {
    
    // muunnetaan crossref.org-palvelun käyttämä viitetyyppi bibtex-muotoon
    
    // aika moni on laitettu tyypiksi 'misc', koska on vaikea arvailla
    // mikä bibtex-tyyppi olisi sopiva ilman laajempaa otosta... 
    
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

    if (Object.prototype.hasOwnProperty.call(tyyppimuunnokset, viitetyyppi)) {             
         return tyyppimuunnokset[viitetyyppi];                
    }
    else {
        return 'misc';
    }

}    


function lueNimet (jsonData, avain) { 

    // muodostetaan kirjoittajien (tai kustannustoimittajien, editor)
    // nimistä merkkijono: sukunimi, etunimi, etunimi sukunimi and etunimi sukunimi
    // eli jokseenkin Chigago-tyyliin
               
    if (!Object.prototype.hasOwnProperty.call(jsonData, avain) ||
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
        return kirjoittajat.slice(0, kirjoittajat.length - 1).join(', ') + ' AND ' + kirjoittajat[kirjoittajat.length - 1];  
    }                        
               
}


function lueTaulukosta(jsonData, avain, indeksi) {

    // oletetaan että avaimen avulla luettava kenttä on taulukko,
    // josta luetaan indeksin osoittama arvo

    if (!Object.prototype.hasOwnProperty.call(jsonData, avain) ||
        typeof jsonData[avain] !== 'object') { 
        return '';
    }

    if (indeksi < 0 || jsonData[avain].length < indeksi + 1) {        
        return '';
    }
    
    return jsonData[avain][indeksi];

}


function luePaivaysTaulukko(jsonData, avain) {

    // oletetaan että avaimen avulla luettava kenttä on objekti,
    // jolla on avain 'date-parts', joka on myös taulukko     
    // palautetaan aina taulukko jossa on kolme merkkijonoa: ['vv', 'kk', 'pp']
    // (osa tai kaikki voi olla tyhjiä merkkijonoja)
  
    // published: { 'date-parts': [ [2025, 12, 24] ] } kuukausi ja päivä voi puuttua!
    if (!Object.prototype.hasOwnProperty.call(jsonData[avain], 'date-parts') ||
        typeof jsonData[avain]['date-parts'] !== 'object' ||
        jsonData[avain]['date-parts'].length == 0) { 
        return ['', '', ''];
    }
 
    return jsonData[avain]['date-parts'][0].map(arvo => arvo.toString()).concat(['', '', '']).slice(0, 3);

}


