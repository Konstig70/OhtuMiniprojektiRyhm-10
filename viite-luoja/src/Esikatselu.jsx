import { useState } from "react";


// Ottaa viitteet taulukossa ja luo esikatselukentän
// Tässä vaiheessa ei ota mitään taulukkoa, vaan käytetään valmiita arvoja
function Esikatselu({ viitteet }) {
  
  /*
  const kentat = () => {
    return (
      viitteet.map((viite) => {
        return (
          // Tähän formatointia yms. viitteille
          // Esim. pilkkoo riveihin ja laittaa jokaisen riviin allaolevan mallin mukaisesti 
          // <span>niin, jolla oikeanlainen luokka ja lopussa <br>
          <p>{viite}</p> 
        )}))}
  */

  // Väliaikainen ratkaisu ihan vain mallin vuoksi
  const Kentat = () => {
    return (
      <ul>
        <p className="esikatseluViite">
          <span>{"@inproceedings{VPL11,"}<br/></span>
          <span className="indent">{"    author = {Vihavainen, Arto and Paksula, Matti and Luukkainen, Matti},"}<br/></span>
          <span className="indent">{"    title = {Extreme Apprenticeship Method in Teaching Programming for Beginners.},"}<br/></span>
          <span className="indent">{"    year = {2011},"}<br/></span>
          <span className="indent">{"    booktitle = {SIGCSE 11: Proceedings of the 42nd SIGCSE technical symposium on Computer science education},"}<br/></span>
          <span>{"}"}<br/></span>
        </p>
        <p className="esikatseluViite">
          <span>{"@inproceedings{CBH91,"}<br/></span>
          <span className="indent">{"    author = {Allan Collins and John Seely Brown and Ann Holum},"}<br/></span>
          <span className="indent">{"    title = {Cognitive apprenticeship: making thinking visible},"}<br/></span>
          <span className="indent">{"    journal = {American Educator},"}<br/></span>
          <span className="indent">{"    year = {1991},"}<br/></span>
          <span className="indent">{"    volume = {6},"}<br/></span>
          <span className="indent">{"    pages = {38--46}"}<br/></span>
          <span>{"}"}<br/></span>
        </p>
        <p className="esikatseluViite">
          <span>{"@inproceedings{Martin09,"}<br/></span>
          <span className="indent">{"    author = {Martin, Robert},"}<br/></span>
          <span className="indent">{"    title = {Clean Code: A Handbook of Agile Software Craftsmanship},"}<br/></span>
          <span className="indent">{"    year = {2008},"}<br/></span>
          <span className="indent">{"    publisher = {Prentice Hall},"}<br/></span>
          <span>{"}"}<br/></span>
        </p>
      </ul>
    )
  }

  return (
    <div>
      <legend>Esikatselu</legend>
      <div className="esikatselu">
        <Kentat />
      </div>
      <button className="kopioi"><img src="/src/assets/copy-icon.svg" alt="Kopioi leikepöydälle"/></button>
    </div>
  )
}

export default Esikatselu