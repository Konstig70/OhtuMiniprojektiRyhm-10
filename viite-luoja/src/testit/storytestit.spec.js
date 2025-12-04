// @ts-check
import { test, expect } from '@playwright/test';

//Story: "Käyttäjänä voin tallentaa nappia painamalla muodostuneen viite tiedoston BibTex-muodossa"
test('Käyttäjänä voin tallentaa nappia painamalla muodostuneen viite tiedoston BibTex-muodossa', async ({ page }) => {
  //Mennään sivulle 
  await page.goto('http://localhost:5173/');
  
  //Valitaan book tyyppinen viite ja odotetaan päivitys
  await page.selectOption('#tyyppiValinta', {label: 'Book'});
  await page.locator('input[type="text"]').first().waitFor({ state: 'visible' });
  //Haetaan inputit 
  const inputit = page.locator('input[type="text"]');
  
  //Käydään kaikki läpi ja täytetään
  const lkm = await inputit.count();
  for (let i = 0; i < lkm; i++) {
    const inputti = inputit.nth(i);
    const name = await inputti.getAttribute("name");
    let arvo = "";

    //Testi arvot
    switch(name) {
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
  const viite = page.locator("p.esikatseluViite");
  const span = viite.locator("span");
  const spanlkm = await span.count(); 

  //Vaihe 2 tutkitaan vastaako jokainen span oikeaa arvoa
  const odotettuViite = [
  "@book{testi1764842080482,",
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
      expect(teksti?.startsWith("@book{testi")).toBe(true);
    } else {
      //Muut testataan suoraan
      expect(teksti).toBe(odotettuViite[i]);
    }
  }
  console.log("kaikki ok!");



});

