
(function(){
  let semCounter = 0;
  function courseRow(){
    return `<tr>
      <td><input class="input code" placeholder="Course"/></td>
      <td><input class="input percent" type="number" min="0" max="100" step="0.01"/></td>
      <td><select class="input letter"><option value="">-- select --</option>${buildLetterOptions()}</select></td>
      <td><input class="input gp" type="number" min="0" max="4" step="0.01" value="0.00" readonly/></td>
      <td><input class="input credit" type="number" min="0" step="0.5" value="3"/></td>
      <td><button class="btn" type="button" onclick="this.closest('tr').remove();recalcAll()">Remove</button></td>
    </tr>`;
  }
  function semesterTemplate(id){
    return `<div class="card" data-sem="${id}">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <h3 style="margin:0">Semester ${id}</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn" onclick="addCourse(${id})">+ Add Course</button>
          <button class="btn" onclick="removeSemester(${id})">Remove Semester</button>
        </div>
      </div>
      <table class="table" style="margin-top:10px">
        <thead><tr><th>Course</th><th>% (optional)</th><th>Letter</th><th>Point</th><th>Credit</th><th></th></tr></thead>
        <tbody></tbody>
      </table>
      <div class="kpis">
        <div class="kpi"><div class="value" id="gpa-${id}">0.00</div><div class="label">Semester GPA</div></div>
        <div class="kpi"><div class="value" id="credits-${id}">0.00</div><div class="label">Semester Credits</div></div>
        <div class="kpi"><div class="value" id="points-${id}">0.00</div><div class="label">Quality Points</div></div>
      </div>
    </div>`;
  }
  function addSemester(){
    const id = ++semCounter;
    const container = document.getElementById('semesters');
    container.insertAdjacentHTML('beforeend', semesterTemplate(id));
    const tbody = container.querySelector(`[data-sem="${id}"] tbody`);
    tbody.insertAdjacentHTML('beforeend', courseRow());
    tbody.insertAdjacentHTML('beforeend', courseRow());
  }
  function removeSemester(id){
    const el = document.querySelector(`[data-sem="${id}"]`);
    if(el) el.remove();
    recalcAll();
  }
  function addCourse(id){
    const tbody = document.querySelector(`[data-sem="${id}"] tbody`);
    tbody.insertAdjacentHTML('beforeend', courseRow());
  }
  function recalcAll(){
    let overallCredits=0, overallPoints=0;
    document.querySelectorAll('[data-sem]').forEach(card=>{
      let credits=0, points=0;
      card.querySelectorAll('tbody tr').forEach(tr=>{
        const p = parseFloat(tr.querySelector('.percent').value);
        const letterSel = tr.querySelector('.letter');
        const gpInput = tr.querySelector('.gp');
        const cr = parseFloat(tr.querySelector('.credit').value)||0;
        if(!isNaN(p)){ const g = percentToGrade(p); if(g.letter){ letterSel.value=g.letter; gpInput.value=g.point.toFixed(2);} else { gpInput.value='0.00'; } }
        else if(letterSel.value){ gpInput.value = letterToPoint(letterSel.value).toFixed(2); }
        const gp = parseFloat(gpInput.value)||0;
        if(cr>0){ credits += cr; points += cr*gp; }
      });
      const gpa = credits>0 ? points/credits : 0;
      card.querySelector(`#gpa-${card.dataset.sem}`).textContent = gpa.toFixed(2);
      card.querySelector(`#credits-${card.dataset.sem}`).textContent = credits.toFixed(2);
      card.querySelector(`#points-${card.dataset.sem}`).textContent = points.toFixed(2);
      overallCredits += credits; overallPoints += points;
    });
    const cgpa = overallCredits>0 ? overallPoints/overallCredits : 0;
    document.getElementById('overallCgpa').textContent = cgpa.toFixed(2);
    document.getElementById('overallCredits').textContent = overallCredits.toFixed(2);
    document.getElementById('overallPoints').textContent = overallPoints.toFixed(2);
  }
  function downloadCSV(){
    const rows=[['Semester','Course','Percent','Letter','Point','Credit']];
    document.querySelectorAll('[data-sem]').forEach(card=>{
      const sem = card.dataset.sem;
      card.querySelectorAll('tbody tr').forEach(tr=>{
        rows.push([
          sem,
          tr.querySelector('.code').value||'',
          tr.querySelector('.percent').value||'',
          tr.querySelector('.letter').value||'',
          tr.querySelector('.gp').value||'',
          tr.querySelector('.credit').value||''
        ]);
      });
    });
    const csv = rows.map(r=>r.map(x=>`"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'aiub-weighted-cgpa.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }
  window.addSemester = addSemester; window.addCourse = addCourse; window.removeSemester = removeSemester;
  window.recalcAll = recalcAll; window.downloadCSV = downloadCSV;
  addSemester();
  document.addEventListener('input', (e)=>{ if(e.target.closest('[data-sem]')) recalcAll(); });
  recalcAll();
})();
