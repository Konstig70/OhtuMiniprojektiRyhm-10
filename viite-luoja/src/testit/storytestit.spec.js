// @ts-check
import { test, expect } from '@playwright/test';

//Laitetaan testit ajamaan sarjassa
test.describe.configure({ mode: 'serial' });

//Ajetaan testit yhdestä "päätestistä, jotta muutokset menevät oikein"
test.describe("E2E testit käyttäjän operaatioista", () => {
  /**
   * Story: "Käyttäjänä voin tallentaa nappia painamalla muodostuneen viite tiedoston BibTex-muodossa"
   * Hyväksymis kriteerit: 
   *  - Valittaessa book-tyyppi oikea määrä ja oikean tyyppiset input tulevat sivulle.
   *  - Inputtien täyttämmisen ja lisää viite napin painamisen jälkeen sivulle esikatselu alueeseen tulee tulla
   *    näkyviin oikeat tiedot BibTex-muodossa
  */
  test('Käyttäjänä voin tallentaa nappia painamalla muodostuneen viite tiedoston BibTex-muodossa', async ({ page }) => {
    //Mennään sivulle 
    await page.goto('https://ohtuminiprojektiryhm-10.onrender.com/');

    //Valitaan book tyyppinen viite ja odotetaan päivitys
    await page.selectOption('#tyyppiValinta', { label: 'Book' });
    await page.locator('input[type="text"]').first().waitFor({ state: 'visible' });
    //Haetaan inputit 
    const inputit = page.locator('.lomake .hakuKentta');

    //Käydään kaikki läpi ja täytetään
    const lkm = await inputit.count();
    for (let i = 0; i < lkm; i++) {
      const inputti = inputit.nth(i);
      const name = await inputti.getAttribute("name");
      let arvo = "";

      //Testi arvot
      switch (name) {
        case "author":
          arvo = "Martin, Robert";
          console.log("author lisätty");
          break;

        case "title":
          arvo = "Clean Code: A Handbook of Agile Software Craftsmanship";
          break;

        case "publisher":
          arvo = "Prentice Hall";
          break;

        case "year":
          arvo = "2008";
          break;

        case "doi":
          arvo = "10.1234/example.doi.5678"; //Testi doi ei vie mihinkään
          break;

        default:
          arvo = "Vakio";
          break;
      }
      //Täytetään arvolla    
      await inputti.fill(arvo);
      //const filledValue = await inputti.inputValue();
      //console.log(`Filled input '${await inputti.getAttribute('name')}' with value: ${filledValue}`);
    }

    //Lisätään viite 
    await page.locator("#viitteenLisays").click();
    console.log("viite lisätty");

    //Tarkistus vaihe 1 haetaan kaikki span elementit
    const viite = page.locator("ul#esikatseluLista p.esikatseluViite");
    const span = viite.locator("span");
    const spanlkm = await span.count();

    //Vaihe 2 tutkitaan vastaako jokainen span oikeaa arvoa
    const odotettuViite = [
      "@book{Martin08,",
      "    author = {Martin, Robert},",
      "    title = {Clean Code: A Handbook of Agile Software Craftsmanship},",
      "    publisher = {Prentice Hall},",
      "    year = {2008},",
      "    doi = {10.1234/example.doi.5678},",
      "}"
    ];

    console.log("Käydään spannint läpi");
    for (let i = 0; i < spanlkm; i++) {
      //Haetaan teksti ja testataan onko arvo oikea
      let teksti = await span.nth(i).textContent();

      //Tämän ei pitäisi tapahtua ikinä, mutta varmuuden vuoksi laitetaan näin
      if (i >= odotettuViite.length) {
        throw new Error(`Ei pitäisi olla spannia indeksissä ${i}! Spannin teksti: ${teksti}`);
      }

      //Eri testi Id:n luonnille, sillä numerosarja generoidaan satunnaisesti, testataan vaan alku
      if (i === 0) {
        console.log("Testataan id");
        expect(teksti?.startsWith("@book{Martin08")).toBe(true);
      } else {
        //Muut testataan suoraan
        expect(teksti).toBe(odotettuViite[i]);
      }
    }
    console.log("kaikki ok!");



  });

  /** 
   * Story: Käyttäjänä voin muokata lisäämiäni viitteitä
   * Hyväksymis kriteerit: 
   *  - Lisättyä viitettä klikatessa oikeat 
   *
   */
  test("Käyttäjänä voin muokata lisäämiäni viitteitä", async ({ page }) => {
    await page.goto("https://ohtuminiprojektiryhm-10.onrender.com/");
    //Odotetaan, että tulee näkyviin
    await page.locator("#viitelistaus > li").first().waitFor({ state: 'visible' });

    //Haetaan viimeinen lisäys mikä on tässä tapauksessa edellisessä testissä lisätty viite
    await page.locator('#viitelistaus > li:last-child > a').click();
  
    //Haetaan inputit
    const inputit = page.locator('.lomake .hakuKentta');
    const inputLkm = await inputit.count();
  
    //Malli tiedot 
    const tiedot = [
      "Martin, Robert",
      "Clean Code: A Handbook of Agile Software Craftsmanship",
      "Prentice Hall",
      "2008",
      "10.1234/example.doi.5678",
      ""
    ]  
    
    //Tarkistetaan, että tiedot ovat oikeat 
    for (let i = 0; i < inputLkm; i++) {
      let sisalto = await inputit.nth(i).inputValue();
      console.log("inputin sisältö: ", sisalto);
      expect(sisalto).toBe(tiedot[i]);
    }

    //Muutetaan authoria
    await inputit.nth(0).fill("Matti Mallikas");

    //Tallenetaan
    await page.locator("#viitteenTallennus").click();
    
    //Tarkistetaan, että tallennetut tiedot ovat oikeat
    const uusiAuthor = page.locator('#viitelistaus > li:last-child > ul > li:first-child');
    expect(uusiAuthor).toHaveText("author: Matti Mallikas");
    

  });

  test("Käyttäjänä voin poistaa lisäämäni viitteen", async ({ page }) => {
    await page.goto("https://ohtuminiprojektiryhm-10.onrender.com/");

    await page.goto("https://ohtuminiprojektiryhm-10.onrender.com/");
    //Odotetaan, että tulee näkyviin
    await page.locator("#viitelistaus > li").first().waitFor({ state: 'visible' });

    //Haetaan viimeinen lisäys mikä on tässä tapauksessa edellisessä testissä lisätty viite
    await page.locator('#viitelistaus > li:last-child > a').click();

    //Lisätään viite
    await page.locator("#viitteenLisays").click();
    //Poistetaan viite lisätyistä
    await page.locator(".esikatseluContainer #viitelistaus button").first().click();
    //Tarkistetaan, että viite on poistunut
    const div = await page.locator(".esikatseluContainer").last().allTextContents();
    expect(div).toEqual([""]);

    //Lopuksi poistetaan vielä listauksesta
    const ennen = await page.locator("#viitelistaus > li").count();
    console.log(`Ennen poistoa oli ${ennen} verran li-elementtejä`);
    await page.locator('#viitelistaus > li:last-child > button').click();
    const jalkeen = await page.locator("#viitelistaus > li").count();
    console.log(`poiston jälkeen oli ${jalkeen} verran li-elementtejä`);
    expect(jalkeen).toBeLessThan(ennen);
     
  });


});



