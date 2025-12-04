// @ts-check
import { test, expect } from '@playwright/test';

//Story: "Käyttäjänä voin tallentaa nappia painamalla muodostuneen viite tiedoston BibTex-muodossa"
test('Käyttäjänä voin tallentaa nappia painamalla muodostuneen viite tiedoston BibTex-muodossa', async ({ page }) => {
  //Mennään sivulle 
  await page.goto('https://ohtuminiprojektiryhm-10.onrender.com/');
  
  //Valitaan book tyyppi
  await page.selectOption('tyyppiValinta', 'book');

  //Täytetään inputit 
  const inputit = await   
});

