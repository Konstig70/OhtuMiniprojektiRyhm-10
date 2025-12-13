// 12.12.2025/Micke

import * as testattavat from '../funkkarit/doihaku.js';


async function luoResponse(jsonData) {
    
    const blob = new Blob([JSON.stringify(jsonData)], { type: "application/json" });
    const response = new Response( blob, { status: 200 });
    return response;
    
}


describe('haeMetadata', () => {

    test('Ei anneta parametria', async () => {
        const result = await testattavat.haeMetadata();
        const expectedResult = 'Virheellinen parametri.'
        expect(result).toEqual(expectedResult);
    });

    test('Parametri on null', async () => {
        const result = await testattavat.haeMetadata(null);
        const expectedResult = 'Virheellinen parametri.'
        expect(result).toEqual(expectedResult);
    });  
        
    test('Parametri on tyhjä merkkijono', async () => {
        const result = await testattavat.haeMetadata('');
        const expectedResult = 'Tarkista DOI-tunnus: '
        expect(result).toEqual(expectedResult);
    });

    test('Virheellinen doi-tunnus', async () => {
        const result = await testattavat.haeMetadata('abcde/efghijkl');
        const expectedResult = 'Tarkista DOI-tunnus: abcde/efghijkl'
        expect(result).toEqual(expectedResult);
    });
    
    test('Virheellinen doi-url', async () => {
        const result = await testattavat.haeMetadata('https://doi.org/abcde/fghij');
        const expectedResult = 'Tarkista DOI-tunnus: https://doi.org/abcde/fghij'
        expect(result).toEqual(expectedResult);
    });

});


describe('kasitteleHaetutMetatiedot', () => {   

    test('Annettu hakufunktio ei ole funktio', async () => {        
        const result = await testattavat.kasitteleHaetutMetatiedot();
        const expectedResult = 'Ohjelmassa on virhe.'
        expect(result).toEqual(expectedResult);
    });     
    
    test('Palvelin ei vastaa', async () => {
        const mockHakufunktio = () => {return 'en vastaa'};
        const result = await testattavat.kasitteleHaetutMetatiedot(mockHakufunktio);
        const expectedResult = 'en vastaa';
        expect(result).toEqual(expectedResult);
    });   

    test('Palvelin palauttaa virheen', async () => {
        const mockHakufunktio = () => {return {'status': 666, 'statusText': 'virhe'}};
        const result = await testattavat.kasitteleHaetutMetatiedot(mockHakufunktio);
        const expectedResult = 'Palvelu antoi virheviestin: 666 virhe.';
        expect(result).toEqual(expectedResult);
    });     

    test('Metatietoja ei löytynyt', async () => {
        const mockHakufunktio = () => {return {'status': 404}};        
        const result = await testattavat.kasitteleHaetutMetatiedot(mockHakufunktio);
        const expectedResult = 'Metatietoja ei löytynyt.';
        expect(result).toEqual(expectedResult);
    });  
   
    test('Metatietojen muunnos ei onnistunut', async () => { 
                       
        const mockHakufunktio = async () => { 
            return luoResponse({'message': {'avain': 'arvo'}});
        }
                      
        const result = await testattavat.kasitteleHaetutMetatiedot(mockHakufunktio);
        const expectedResult = 'Metatietojen muunnoksessa tuli virhe.';
        expect(result).toEqual(expectedResult);
    });

    test('Metatietojen muunnos onnistui', async () => {                        
        
        const metadata = {
            'publisher': 'Julkaisija',    
            'DOI': 'Doi-tunnus',
            'type': 'journal-article',    
            'title': ['Titteli'],  
            'volume': '123',
            'author': [
            {'given': 'Etunimi1', 'family': 'Sukunimi1'},
            {'given': 'Etunimi2', 'family': 'Sukunimi2'}      
            ],  
            'container-title': [ 'Julkaisu' ],
            'URL': 'Internetosoite',
            'published': { 'date-parts': [ [2025, 12, 24] ] }  
        };

        const expectedResult = {
            'author': 'Sukunimi1, Etunimi1 and Etunimi2 Sukunimi2',
            'booktitle': 'Titteli',
            'journal': 'Julkaisu',
            'month': '12',
            'publisher': 'Julkaisija',
            'series': 'Julkaisu',
            'title': 'Titteli',
            'type': 'article',
            'volume': '123',
            'year': '2025',
            'doi': 'Doi-tunnus',
            'url': 'Internetosoite',
            'citekey': 'Sukunimi12025'
        };

        const mockHakufunktio = async () => { 
            return luoResponse({'message': metadata});
        }        
                              
        const result = await testattavat.kasitteleHaetutMetatiedot(mockHakufunktio);
        expect(result).toEqual(expectedResult);
        
    }); 
 
});


describe('lueKentat', () => {      
   
    test('Ei anneta parametria', () => {                        
        const result = testattavat.lueKentat();
        const expectedResult = 'Metatietojen muunnoksessa tuli virhe.';
        expect(result).toEqual(expectedResult);
    }); 
 
    test('Annetaan tyhjät tiedot', () => {                        
        const result = testattavat.lueKentat({});
        const expectedResult = 'Metatietojen muunnoksessa tuli virhe.';
        expect(result).toEqual(expectedResult);
    });    
     
});


describe('luoCitekey', () => {      
   
    test('Ei anneta parametria', () => {                        
        const result = testattavat.luoCitekey();
        const expectedResult = '';
        expect(result).toEqual(expectedResult);
    }); 
 
    test('Annetaan tyhjät tiedot', () => {                        
        const result = testattavat.luoCitekey({});
        const expectedResult = '';
        expect(result).toEqual(expectedResult);
    });
   
    test('Luodaan citekey kirjailijoista', () => {                        
        const result = testattavat.luoCitekey({'author': 'Hermanni, Pelle, Leipuri Pulla', 'year': '1234'});
        const expectedResult = 'Hermanni1234';
        expect(result).toEqual(expectedResult);
    }); 
    
    test('Luodaan citekey kustannustoimittajista', () => {                        
        const result = testattavat.luoCitekey({'editor': 'Hermanni, Pelle, Leipuri Pulla', 'year': '1234'});
        const expectedResult = 'Hermanni1234';
        expect(result).toEqual(expectedResult);
    }); 
 
    test('Luodaan citekey doi-tunnuksesta', () => {                        
        const result = testattavat.luoCitekey({'doi': '  /123.00.45/jotain '});
        const expectedResult = '1230045jotain';
        expect(result).toEqual(expectedResult);
    }); 
 
});


describe('lueViitetyyppi', () => {      
   
    test('Ei anneta parametria', () => {                        
        const result = testattavat.lueViitetyyppi();
        const expectedResult = '';
        expect(result).toEqual(expectedResult);
    }); 
 
    test('Annetaan tyhjät tiedot', () => {                        
        const result = testattavat.lueViitetyyppi({}, 'type');
        const expectedResult = '';
        expect(result).toEqual(expectedResult);
    });
    
    test('Tuntematon tyyppi, saadaan oletusarvo', () => {                        
        const result = testattavat.lueViitetyyppi({'type': 'tuntematon'}, 'type');
        const expectedResult = 'misc';
        expect(result).toEqual(expectedResult);
    });   
   
    test('Tyyppimuunnos onnistui', () => {                        
        const result = testattavat.lueViitetyyppi({'type': 'proceedings-series'}, 'type');
        const expectedResult = 'proceedings';
        expect(result).toEqual(expectedResult);
    }); 
     
});


describe('lueNimet', () => {      

    test('Ei anneta parametria', () => {                        
        const result = testattavat.lueNimet();
        const expectedResult = '';
        expect(result).toEqual(expectedResult);
    }); 
 
    test('Annetaan tyhjät tiedot', () => {                        
        const result = testattavat.lueNimet({}, 'author');
        const expectedResult = '';
        expect(result).toEqual(expectedResult);
    });    
       
    test('Nimien luku onnistui: yksi nimi', () => {              
        const author = [ 
            {given: 'Etunimi1', family: 'Sukunimi1'}
        ];
        const result = testattavat.lueNimet({'author': author}, 'author');
        const expectedResult = 'Sukunimi1, Etunimi1';
        expect(result).toEqual(expectedResult);
    }); 
    
    test('Nimien luku onnistui: kaksi nimeä', () => {              
        const author = [ 
            {given: 'Etunimi1', family: 'Sukunimi1'},
            {given: 'Etunimi2', family: 'Sukunimi2'}
        ];
        const result = testattavat.lueNimet({'author': author}, 'author');
        const expectedResult = 'Sukunimi1, Etunimi1 and Etunimi2 Sukunimi2';
        expect(result).toEqual(expectedResult);
    }); 
    
    test('Nimien luku onnistui: kolme nimeä', () => {              
        const author = [ 
            {given: 'Etunimi1', family: 'Sukunimi1'},
            {given: 'Etunimi2', family: 'Sukunimi2'},
            {given: 'Etunimi3', family: 'Sukunimi3'}
        ];
        const result = testattavat.lueNimet({'author': author}, 'author');
        const expectedResult = 'Sukunimi1, Etunimi1, Etunimi2 Sukunimi2 and Etunimi3 Sukunimi3';
        expect(result).toEqual(expectedResult);
    }); 
     
});


describe('lueTaulukosta', () => {      
       
    test('Ei anneta parametria', () => {                        
        const result = testattavat.lueTaulukosta();
        const expectedResult = '';
        expect(result).toEqual(expectedResult);
    }); 
 
    test('Annetaan tyhjät tiedot', () => {                        
        const result = testattavat.lueTaulukosta({}, 'taulukko', 0);
        const expectedResult = '';
        expect(result).toEqual(expectedResult);
    });        
       
    test('Taulukosta luku epäonnistui, indeksi on liian pieni', () => {              
        const taulukko = [111, 222, 333];
        const result = testattavat.lueTaulukosta({'taulukko': taulukko}, 'taulukko', -1);
        const expectedResult = '';
        expect(result).toEqual(expectedResult);
    });     
    
    test('Taulukosta luku epäonnistui, indeksi on liian suuri', () => {              
        const taulukko = [111, 222, 333];
        const result = testattavat.lueTaulukosta({'taulukko': taulukko}, 'taulukko', 3);
        const expectedResult = '';
        expect(result).toEqual(expectedResult);
    });   
    
    test('Taulukosta luku onnistui', () => {              
        const taulukko = [111, 222, 333];
        const result = testattavat.lueTaulukosta({'taulukko': taulukko}, 'taulukko', 2);
        const expectedResult = '333';
        expect(result).toEqual(expectedResult);
    }); 
     
});


describe('luePaivaysTaulukko', () => {      
       
    test('Ei anneta parametria', () => {                        
        const result = testattavat.luePaivaysTaulukko();
        const expectedResult = ['', '', ''];
        expect(result).toEqual(expectedResult);
    }); 
 
    test('Annetaan tyhjät tiedot', () => {                        
        const result = testattavat.luePaivaysTaulukko({}, 'taulukko');
        const expectedResult = ['', '', ''];
        expect(result).toEqual(expectedResult);
    });        
       
    test('Annetaan puutteelliset tiedot1', () => {                        
        const result = testattavat.luePaivaysTaulukko({'taulukko': {'date-parts': []}}, 'taulukko');
        const expectedResult = ['', '', ''];
        expect(result).toEqual(expectedResult);
    });    
    
    test('Annetaan puutteelliset tiedot2', () => {                        
        const result = testattavat.luePaivaysTaulukko({'taulukko': {'date-parts': [[]]}}, 'taulukko');
        const expectedResult = ['', '', ''];
        expect(result).toEqual(expectedResult);
    }); 
    
    test('Päivä puuttuu', () => {                        
        const result = testattavat.luePaivaysTaulukko({'taulukko': {'date-parts': [[1234, 56]]}}, 'taulukko');
        const expectedResult = ['1234', '56', ''];
        expect(result).toEqual(expectedResult);
    });
    
    test('Kuukausi ja päivä puuttuu', () => {                        
        const result = testattavat.luePaivaysTaulukko({'taulukko': {'date-parts': [[1234]]}}, 'taulukko');
        const expectedResult = ['1234', '', ''];
        expect(result).toEqual(expectedResult);
    });

    test('Kaikki tiedot löytyy', () => {                        
        const result = testattavat.luePaivaysTaulukko({'taulukko': {'date-parts': [[1234, 56, 78]]}}, 'taulukko');
        const expectedResult = ['1234', '56', '78'];
        expect(result).toEqual(expectedResult);
    });    
         
});







