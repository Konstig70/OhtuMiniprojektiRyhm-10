import { jest } from '@jest/globals';
import { luoBibtexMerkkijono } from '../funkkarit/jsonToBibtex.js';

describe('luoBibtexMerkkijono', () => {

  test('Parametri on null', () => {
    const result = luoBibtexMerkkijono(null);
    expect(result).toBeNull();
  });

  test('Parametri on tyhjä taulukko', () => {
    const result = luoBibtexMerkkijono([]);
    expect(result).toBeNull();
  });

  test('Viitteen tyyppi puuttuu', () => {
    const result = luoBibtexMerkkijono([{"citekey": "citekey1", "author": "Kirjailija1"}]);
    expect(result).toBeNull();
  });

  test('Viitteen tyyppi on virheellinen', () => {
    const result = luoBibtexMerkkijono([{"type": "kirja", "citekey": "citekey1", "author": "Kirjailija1"}]);
    expect(result).toBeNull();
  });

  test('Citekey puuttuu', () => {
    const result = luoBibtexMerkkijono([{"type": "book", "author": "Kirjailija1"}]);
    expect(result).toBeNull();
  });

  test('Citekey on virheellinen', () => {
    const result = luoBibtexMerkkijono([{"type": "book", "citekey": null, "author": "Kirjailija1"}]);
    expect(result).toBeNull();
  });

  test('Viitteessä ei ole muita tietoja kuin tyyppi ja citekey', () => {
    const result = luoBibtexMerkkijono([{"type": "book", "citekey": "citekey1"}]);
    expect(result).toBeNull();
  });

  test('Viitteessä on tuntemattomia kenttiä', () => {
    const result = luoBibtexMerkkijono([{"type": "book", "citekey": "citekey1", "author": "Kirjailija1", "tagit": ["1", "2"]}], {"indentation": () => '__', "newline": () => '++', "entry": (value) => `${value}??`});
    expect(result).toEqual("@book{citekey1,++__author = {Kirjailija1}++}??");
  });

  test('Viitteessä on  kenttiä', () => {
    const result = luoBibtexMerkkijono([{"type": "book", "citekey": "citekey1", "author": "Kirjailija1", "tagit": ["1", "2"]}], {"indentation": () => '__', "newline": () => '++', "entry": (value) => `${value}??`});
    expect(result).toEqual("@book{citekey1,++__author = {Kirjailija1}++}??");
  });

  test('BibTeX muodostuu oikein yhdestä viitteestä', () => {

    const result = luoBibtexMerkkijono([{"type": "manual", "citekey": "citekey1", "author": "Kirjailija1", "title": "Julkaisu1"}]);
    expect(result).toEqual("@manual{citekey1,\n  author = {Kirjailija1},\n  title = {Julkaisu1}\n}\n\n");

  });

  test('BibTeX muodostuu oikein kahdesta viitteestä', () => {

    const jsonData = [
      { "type": "manual", "citekey": "citekey1", "author": "Kirjailija1", "title": "Julkaisu1" },
      { "type": "misc", "citekey": "citekey2", "author": "Kirjailija2", "title": "Julkaisu2" }
    ];

    const expectedResult = "@manual{citekey1,\n  author = {Kirjailija1},\n  title = {Julkaisu1}\n}\n\n" +
                           "@misc{citekey2,\n  author = {Kirjailija2},\n  title = {Julkaisu2}\n}\n\n";

    const result = luoBibtexMerkkijono(jsonData);
    expect(result).toEqual(expectedResult);

  });

  test('Muotoiltu BibTeX muodostuu oikein yhdestä viitteestä', () => {

    const formattingFunctions = {
      "indentation": () => '__',
      "newline": () => '++',
      "type": (value) => `!${value.toUpperCase()}!`,
      "citekey": (value) => `?${value.toUpperCase()}?`,
      "key": (value) => `#${value.toUpperCase()}#`,
      "value": (value) => `@${value.toUpperCase()}@`,
      "entry": (value) => `<${value}>`
    };

    const result = luoBibtexMerkkijono([{"type": "book", "citekey": "citekey1", "author": "Kirjailija1", "title": "Julkaisu1"}], formattingFunctions);
    expect(result).toEqual("<!@BOOK!{?CITEKEY1?,++__#AUTHOR# = @{KIRJAILIJA1}@,++__#TITLE# = @{JULKAISU1}@++}>");

  });

  test('Muotoiltu BibTeX muodostuu oikein kahdesta viitteestä', () => {

    const formattingFunctions = {
      "indentation": () => '...',
      "newline": () => ';;;',
      "type": (value) => `!${value.toUpperCase()}!`,
      "citekey": (value) => `?${value.toUpperCase()}?`,
      "key": (value) => `#${value.toUpperCase()}#`,
      "value": (value) => `@${value.toUpperCase()}@`,
      "entry": (value) => `<${value}>`
    };

    const jsonData = [
      { "type": "book", "citekey": "citekey1", "author": "Kirjailija1", "title": "Julkaisu1" },
      { "type": "article", "citekey": "citekey2", "author": "Kirjailija2", "title": "Julkaisu2" }
    ];

    const expectedResult = "<!@BOOK!{?CITEKEY1?,;;;...#AUTHOR# = @{KIRJAILIJA1}@,;;;...#TITLE# = @{JULKAISU1}@;;;}>" +
                           "<!@ARTICLE!{?CITEKEY2?,;;;...#AUTHOR# = @{KIRJAILIJA2}@,;;;...#TITLE# = @{JULKAISU2}@;;;}>";

    const result = luoBibtexMerkkijono(jsonData, formattingFunctions);
    expect(result).toEqual(expectedResult);

  });

});
