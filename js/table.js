import {
  GIORNATA_MIN, parseOrario, fmtMin, highlightField, hhmmReg
} from './utils.js';

export function generaTabella(container, { dip, anno, mese, lordoArr }) {
  const giorniSet = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
  let html = `<table id="oreTable"><thead><tr>
      <th>DATA</th><th>GIORNO</th><th>TOT</th>
      <th>ORD.</th><th>STRAORD.</th><th>ASSENZA</th><th>CAUSALE</th>
      </tr></thead><tbody>`;

  lordoArr.forEach((lv, idx) => {
    const d   = new Date(anno, mese - 1, idx + 1),
          dow = d.getDay(),
          wk  = dow === 0 || dow === 6,
          min = parseOrario(lv);
    let ord = '', str = '', ass = '', tr = '';

    if (!isNaN(min) && min >= GIORNATA_MIN) {
      ord = fmtMin(GIORNATA_MIN);
      if (min > GIORNATA_MIN) { str = fmtMin(min - GIORNATA_MIN); tr = 'stra'; }
    } else if (!wk) {
      if (!isNaN(min) && min > 0) {
        ord = fmtMin(min); ass = fmtMin(GIORNATA_MIN - min); tr = 'ass';
      } else { ass = fmtMin(GIORNATA_MIN); tr = 'ass'; }
    } else if (wk && !isNaN(min) && min > 0) { str = fmtMin(min); tr = 'stra'; }

    html += `<tr class="${tr}">
      <td>${String(idx+1).padStart(2,'0')}/${String(mese).padStart(2,'0')}/${anno}</td>
      <td>${giorniSet[dow]}</td><td>${lv}</td>
      <td><input class="hhmm ord"       placeholder="00:00" value="${ord}"></td>
      <td><input class="hhmm straord"   placeholder="00:00" value="${str}"></td>
      <td><input class="hhmm assenza"   placeholder="00:00" value="${ass}"></td>
      <td><input class="causale" list="causaliList" placeholder="-"></td></tr>`;
  });

  html += `</tbody><tfoot><tr><td colspan="3">Totali</td>
      <td id="totOrd">00:00</td><td id="totStraord">00:00</td><td id="totAssenza">00:00</td><td></td>
    </tr></tfoot></table>`;

  container.innerHTML = html;

  // evidenzia iniziale
  container.querySelectorAll('input.hhmm').forEach(highlightField);

  // event delegation
  container.addEventListener('input', e => {
    if (!e.target.classList.contains('hhmm')) return;
    validateHHMM(e.target);
  });

  container.addEventListener('blur', e => {
    if (!e.target.classList.contains('hhmm')) return;
    const min = parseOrario(e.target.value);
    e.target.value = isNaN(min) ? '' : fmtMin(min);
    validateHHMM(e.target);
  }, true);

  calcTotali(container);
}

function validateHHMM(inp) {
  const val = inp.value.trim();
  if (val === '' || hhmmReg.test(val)) {
    inp.classList.remove('invalid'); highlightField(inp);
  } else {
    inp.classList.add('invalid');
    inp.classList.remove('nz-ord', 'nz-str', 'nz-ass');
  }
  calcTotali(inp.closest('#tabellaContainer'));
}

function calcTotali(cont) {
  const sum = sel => [...cont.querySelectorAll(sel)]
     .reduce((t,i)=> t + (i.classList.contains('invalid')?0:parseOrario(i.value||'00:00')), 0);
  cont.querySelector('#totOrd').textContent      = fmtMin(sum('.ord'));
  cont.querySelector('#totStraord').textContent  = fmtMin(sum('.straord'));
  cont.querySelector('#totAssenza').textContent  = fmtMin(sum('.assenza'));
}
