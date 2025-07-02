import { COLONNA, PRIMA_RIGA, norm } from './utils.js';

let workbookCache = null;
export function getWorkbook() { return workbookCache; }

/* carica file, popola select fogli e restituisce una Promise con il workbook */
export function loadExcel(file, sheetSelect, loader) {
  return new Promise((resolve, reject) => {
    workbookCache = null;
    sheetSelect.innerHTML = '<option>-- carica file --</option>';
    sheetSelect.disabled = true;
    if (!file) return reject('Nessun file');

    loader.style.display = 'flex';
    const fr = new FileReader();
    fr.onload = e => {
      try {
        workbookCache = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        sheetSelect.innerHTML = '';
        workbookCache.SheetNames.forEach(n => sheetSelect.add(new Option(n, n)));
        sheetSelect.disabled = false;
        resolve(workbookCache);
      } catch (err) { reject(err); }
      finally { loader.style.display = 'none'; }
    };
    fr.onerror = err => { loader.style.display = 'none'; reject(err); };
    fr.readAsArrayBuffer(file);
  });
}

/* estrae un array lordo[] dal foglio */
export function extractLordo(sheet, giorni) {
  return [...Array(giorni)].map((_, i) =>
    norm(sheet[COLONNA + (PRIMA_RIGA + i)]?.v)
  );
}
