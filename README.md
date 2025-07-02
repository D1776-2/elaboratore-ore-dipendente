# Geobadge Timesheet 🕒  
_Elaboratore ore mensili – client-side_

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Web-app **100 % front-end** che importa i report `.xlsx` esportati da **Geobadge**, 
calcola ordinarie/straordinarie/assenze, permette correzioni manuali e genera un PDF riepilogativo con la stessa evidenziazione colori mostrata a schermo.

---

## ✨ Funzionalità

| Area | Dettagli |
|------|----------|
| **Import Excel** | Parsing in-browser con [SheetJS](https://sheetjs.com/) – nessun dato inviato a server. |
| **Calcolo automatico** | Regole da contratto: giornata minima 8 h, straordinarie oltre soglia, assenza su feriale sotto soglia. |
| **Correzioni manuali** | Celle _“HH:MM”_ editabili + validazione in tempo reale. |
| **Evidenziazione** | Valori ≠ 00:00 colorati (giallino=ord., verdino=straord., rosino=assenza). |
| **PDF professionale** | Titolo _«Riepilogo ore lavorate – Maggio 2025 · Paolo Romano»_<br>Tabella con stessi colori; totali in calce. |
| **Offline-ready** | Tutto in locale: puoi lavorare senza connessione. |
| **Responsive UI** | Controlli su una riga in desktop, layout fluido su tablet/phone. |

---

## 📂 Struttura progetto

geobadge-timesheet/
├─ index.html # markup e palette brand
├─ style.css # look moderno, adaptive
├─ js/
│ ├─ utils.js # funzioni condivise (orario, highlight…)
│ ├─ excel.js # parsing .xlsx + cache workbook
│ ├─ table.js # build tabella, totali, evidenziazione
│ ├─ pdf.js # esportazione PDF (jsPDF + AutoTable)
│ └─ main.js # glue-code, event handling
├─ assets/ # (logo, icone – opzionale)
├─ .gitignore
├─ LICENSE
└─ README.md

## 🖥️ Procedura operativa (anche visibile in app)

Scaricare la cartella .xlsx da Geobadge.
Caricare la lista dipendenti aggiornata (file .json, .csv o .txt).
Selezionare il dipendente.
Caricare il file Excel.
Scegliere il foglio da elaborare.
Compilare eventuali causali.
Clic su ⤓ Esporta PDF.

## 🛠️ Stack tecnico

HTML 5 + ES6 modules
SheetJS @ 0.20 – parsing Excel
jsPDF @ 2.5 + AutoTable @ 3.5
CSS flexbox / media-queries – zero framework
