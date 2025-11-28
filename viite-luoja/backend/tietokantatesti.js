import sqlite from 'node:sqlite';
import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';

// TÄMÄ ON VAIN TIETOKANNAN LUONNIN TESTAUSTA VARTEN

export function testaaTietokanta() {

    const tiedostopolkuTietokanta = new URL('./tietokanta.db', import.meta.url);
    const db = new DatabaseSync(tiedostopolkuTietokanta);
    //const database = new DatabaseSync(':memory:');
    
    const taulu = "viitteet";

    db.exec(`
      CREATE TABLE IF NOT EXISTS ${taulu}(
        citekey TEXT PRIMARY KEY UNIQUE NOT NULL,
        tyyppi TEXT,
        author TEXT,
        title TEXT        
      ) STRICT;    
      CREATE TABLE IF NOT EXISTS tagit (
        citekey TEXT NOT NULL,
        tagi TEXT NOT NULL,
        PRIMARY KEY (citekey, tagi),
        FOREIGN KEY (citekey) REFERENCES ${taulu} (citekey)
        ON UPDATE CASCADE
        ON DELETE CASCADE        
      ) STRICT
    `);
    
    // korjaa on update ja on delete ... 

    const insert = db.prepare(`INSERT OR REPLACE INTO ${taulu} VALUES (?, ?, ?, ?)`);
    insert.run('viite1', 'book', 'Chalmers', 'What is this thing called science?');
    insert.run('viite2', 'article', 'Austin Powers', 'What is this thing about Dr. Evil?');
    insert.run('viite3', 'article', 'Dr. Evil', 'Is Austin Powers really cool or not?');
    
    const insertTagit = db.prepare(`INSERT OR REPLACE INTO tagit VALUES (?, ?)`);
    insertTagit.run('viite1', 'tagi1');
    insertTagit.run('viite1', 'tagi2');
    insertTagit.run('viite2', 'tagi2');
    insertTagit.run('viite2', 'tagi3');       
        
    
    //const query = db.prepare(`SELECT * FROM ${taulu} ORDER BY citekey`);
    //console.log(query.all());
    //console.log(JSON.stringify(query.all()));
    
    const query2 = db.prepare(`
      SELECT ${taulu}.*, tagit
      FROM ${taulu}
      LEFT JOIN 
       (
          SELECT citekey, json_group_array(tagi) as tagit
          FROM tagit           
          GROUP BY citekey
        ) AS viitteentagit 
      ON ${taulu}.citekey = viitteentagit.citekey      
    `);    
    
    // json_group_array palauttaa string '["tagi1", ...]' -> JSON.parse -> ['tagi1', ...]
    // null -> JSON.parse -> null
  
    console.log(query2.all());    
    console.log(JSON.parse(query2.all()[0].tagit));
    
    db.close();

}

testaaTietokanta();