
const AIUB_GRADING = [
  {min: 90, max: 100, letter: 'A+', point: 4.00},
  {min: 85, max: 89.9999, letter: 'A',  point: 3.75},
  {min: 80, max: 84.9999, letter: 'B+', point: 3.50},
  {min: 75, max: 79.9999, letter: 'B',  point: 3.25},
  {min: 70, max: 74.9999, letter: 'C+', point: 3.00},
  {min: 65, max: 69.9999, letter: 'C',  point: 2.75},
  {min: 60, max: 64.9999, letter: 'D+', point: 2.50},
  {min: 50, max: 59.9999, letter: 'D',  point: 2.25},
  {min: 0,  max: 49.9999, letter: 'F',  point: 0.00}
];
function percentToGrade(p){
  if (p == null || isNaN(p)) return {letter:'', point:0};
  const x = Math.max(0, Math.min(100, Number(p)));
  for(const row of AIUB_GRADING){
    if(x >= row.min && x <= row.max) return {letter: row.letter, point: row.point};
  }
  return {letter:'', point:0};
}
function letterToPoint(letter){
  const row = AIUB_GRADING.find(r => r.letter === letter);
  return row ? row.point : 0;
}
function buildLetterOptions(){
  return AIUB_GRADING.map(r=>`<option value="${r.letter}">${r.letter} (${r.min}-${r.max})</option>`).join('');
}
