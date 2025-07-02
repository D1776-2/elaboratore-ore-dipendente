// funzioni generiche + costanti condivise
export const COLONNA = 'X';
export const PRIMA_RIGA = 8;
export const GIORNATA_MIN = 8 * 60;
export const hhmmReg = /^([0-1]?\d|2[0-3]):[0-5]\d$/;

/* "HH:MM" → minuti */
export function parseOrario(s) {
  if (!s || (s = s.trim()) === '' || s === '0') return 0;
  const m = s.match(/^(\d{1,2}):([0-5]\d)$/);
  return m ? (+m[1]) * 60 + (+m[2]) : NaN;
}

/* minuti → "HH:MM" */
export function fmtMin(min) {
  if (min == null || isNaN(min)) return '';
  return (
    String(Math.floor(min / 60)).padStart(2, '0') +
    ':' +
    String(min % 60).padStart(2, '0')
  );
}

/* normalizza valore da Excel */
export function norm(v) {
  if (v == null) return '00:00';
  if (typeof v === 'number') return fmtMin(Math.round(v * 24 * 60));
  v = v.toString().trim();
  if (v === '' || v === '0') return '00:00';
  v = v.replace('.', ':');
  const m = v.match(/^(\d{1,2})(?::([0-5]?\d))?$/);
  if (!m) return '00:00';
  return m[1].padStart(2, '0') + ':' + (m[2] || '00').padStart(2, '0');
}

/* evidenzia celle non-zero */
export function highlightField(inp) {
  const v = parseOrario(inp.value);
  inp.classList.remove('nz-ord', 'nz-str', 'nz-ass');
  if (v > 0) {
    if (inp.classList.contains('ord')) inp.classList.add('nz-ord');
    if (inp.classList.contains('straord')) inp.classList.add('nz-str');
    if (inp.classList.contains('assenza')) inp.classList.add('nz-ass');
  }
}
