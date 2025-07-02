import { parseOrario } from './utils.js';

export function generaPDF(container) {
  const dip  = container.dataset.dip  || 'dipendente';
  const anno = container.dataset.anno || '';
  const mese = container.dataset.mese || '';

  /* clone + replace input/causale */
  const clone = container.querySelector('#oreTable').cloneNode(true);

  clone.querySelectorAll('input.hhmm').forEach(inp=>{
    const td = inp.parentNode; td.textContent = inp.value || '00:00';
  });
  clone.querySelectorAll('input.causale').forEach(inp=>{
    const td = inp.parentNode; td.textContent = inp.value.trim();
  });

  const { jsPDF } = window.jspdf; const doc = new jsPDF();
/* titolo professionale */
const mesi = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno',
               'Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
const titolo = `Riepilogo ore lavorate – ${mesi[+mese-1]} ${anno} · ${dip}`;
doc.setFontSize(14);
doc.text(titolo, 10, 10);

  doc.autoTable({
    html: clone,
    startY: 20,
    styles:{halign:'center',cellPadding:2,fontSize:8},
    headStyles:{fillColor:[200,200,200]},
    didParseCell: data => {
      if (data.section !== 'body') return;
      const col = data.column.index;
      const val = (data.cell.text[0]||'').trim();
      if (val === '' || val === '00:00') return;
      if      (col === 3) data.cell.styles.fillColor = [255,249,196];
      else if (col === 4) data.cell.styles.fillColor = [208,248,206];
      else if (col === 5) data.cell.styles.fillColor = [255,224,224];
    }
  });

  const y = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.text(
    `Totali  ORD: ${container.querySelector('#totOrd').textContent}   `+
    `STRAORD: ${container.querySelector('#totStraord').textContent}   `+
    `ASSENZA: ${container.querySelector('#totAssenza').textContent}`,
    10, y);

  doc.save(`report_ore_${dip.replace(/ /g,'_')}_${anno}-${mese}.pdf`);
}
