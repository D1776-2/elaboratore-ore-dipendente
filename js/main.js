import { loadExcel, extractLordo, getWorkbook } from './excel.js';
import { generaTabella }                    from './table.js';
import { generaPDF }                        from './pdf.js';
import { parseOrario }                      from './utils.js';

/* ─── riferimenti DOM globali ─── */
const dipSel   = document.getElementById('dipendenteSelect');
const fileIn   = document.getElementById('fileInput');
const sheetSel = document.getElementById('sheetSelect');
const contTab  = document.getElementById('tabellaContainer');
const loader   = document.getElementById('loader');
const pdfBtn   = document.getElementById('pdfBtn');

/* lista dipendenti */
const defaultDip = ['Mario Rossi','Luisa Bianchi','Giovanni Verdi','Paola Neri'];
populateDip(defaultDip);

document.getElementById('dipListInput').addEventListener('change', e=>{
  const f = e.target.files[0];
  if(!f){ populateDip(defaultDip); return; }
  const fr = new FileReader();
  fr.onload = ev=>{
    let arr=[]; try{ arr=JSON.parse(ev.target.result);}catch{arr=ev.target.result.split(/\r?\n/);}
    arr=arr.map(s=>s.trim()).filter(Boolean);
    populateDip(arr.length?arr:defaultDip);
  };
  fr.readAsText(f,'utf-8');
});

function populateDip(list){
  dipSel.innerHTML='<option value="">-- seleziona --</option>';
  list.forEach(n=>dipSel.add(new Option(n,n)));
}

/* carica excel */
fileIn.addEventListener('change', ()=> loadExcel(fileIn.files[0], sheetSel, loader)
  .catch(err=>alert('Errore Excel: '+err)) );

/* genera tabella */
document.getElementById('importBtn').addEventListener('click', ()=>{
  const dip = dipSel.value,
        meseV = document.getElementById('meseSelezionato').value,
        foglio= sheetSel.value;
  if(!dip || !meseV || !fileIn.files[0] || !foglio){ alert('Compila tutti i campi'); return; }

  const [anno,mese]=meseV.split('-').map(Number),
        giorni     = new Date(anno, mese, 0).getDate();
        const wb         = getWorkbook();
        const sheet      = wb ? wb.Sheets[foglio] : null;
  if(!sheet){ alert('Ricarica il file.'); return; }

  const lordo = extractLordo(sheet, giorni);
  contTab.dataset.dip=dip; contTab.dataset.anno=anno; contTab.dataset.mese=String(mese).padStart(2,'0');
  document.getElementById('nomeDip').textContent='Dipendente: '+dip;

  generaTabella(contTab,{dip,anno,mese,lordoArr:lordo});
  pdfBtn.disabled=false;
});

/* PDF */
pdfBtn.addEventListener('click', ()=> generaPDF(contTab));
