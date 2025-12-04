import { poistaViite } from '../funkkarit/poisto.js';

describe("poistaViite", () => {
  test("poistetaan olemassa oleva viite", () => {
    let poistettava = {"citekey": "abc", "type": "article"};
    let expected = [{"citekey": "123"}, {"citekey": "987", "type": "book"}];
    let viitteet = [...expected, poistettava];
    let result = poistaViite(viitteet, () => null, poistettava);
    expect(result).toEqual(expected);
  });

  test("yritetään poistaa viite, joka ei ole listassa", () => {
    let poistettava = {"citekey": "abc"};
    let viitteet = [{"citekey": "123"}];
    let result = poistaViite(viitteet, () => null, poistettava);
    expect(result).toEqual(viitteet);
  });

  test("yritetään poistaa viite, jolla ei ole citekeytä", () => {
    let poistettava = {};
    let viitteet = [{"citekey": "123", "type": "book"}, {"citekey": "987", "type": "article"}];
    let result = poistaViite(viitteet, () => null, poistettava);
    expect(result).toEqual(viitteet);
  });
});
