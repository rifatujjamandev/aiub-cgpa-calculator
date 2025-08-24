
(function(){
  function rowTemplate(){
    return `<tr>
      <td><input class="input code" placeholder="CSE 101"/></td>
      <td><input class="input percent" type="number" min="0" max="100" step="0.01" placeholder="e.g., 87.5"/></td>
      <td>
        <select class="input letter">
          <option value="">-- select --</option>
          ${buildLetterOptions()}
        </select>
      </td>
      <td><input class="input gp" type="number" min="0" max="4" step="0.01" value="0.00" readonly/></td>
      <td><input class="input credit" type="number" min="0" step="0.5" value="3"/></td>
      <td><button class="btn" type="button" onclick="this.closest('tr').remove();recalc()">Remove</button></td>
    </tr>`;
  }
  function addRow(){ document.querySelector('#courses tbody').insertAdjacentHTML('beforeend', rowTemplate()); }
  function clearAll(){ document.querySelector('#courses tbody').innerHTML=''; recalc(); }
  function recalc(){
    let totalCredits=0, totalPoints=0;
    document.querySelectorAll('#courses tbody tr').forEach(tr=>{
      const p = parseFloat(tr.querySelector('.percent').value);
      const letterSel = tr.querySelector('.letter');
      const gpInput = tr.querySelector('.gp');
      const credit = parseFloat(tr.querySelector('.credit').value)||0;
      if(!isNaN(p)){ const g = percentToGrade(p); if(g.letter){ letterSel.value=g.letter; gpInput.value=g.point.toFixed(2);} else { gpInput.value='0.00'; } }
      else if(letterSel.value){ gpInput.value = letterToPoint(letterSel.value).toFixed(2); }
      const gp = parseFloat(gpInput.value)||0;
      if(credit>0){ totalCredits+=credit; totalPoints+=credit*gp; }
    });
    const cgpa = totalCredits>0 ? totalPoints/totalCredits : 0;
    document.getElementById('credits').textContent = totalCredits.toFixed(2);
    document.getElementById('points').textContent  = totalPoints.toFixed(2);
    document.getElementById('cgpa').textContent    = cgpa.toFixed(2);
  }
  function downloadCSV(){
    const rows = [['Course','Percent','Letter','Grade Point','Credit']];
    document.querySelectorAll('#courses tbody tr').forEach(tr=>{
      rows.push([
        tr.querySelector('.code').value||'',
        tr.querySelector('.percent').value||'',
        tr.querySelector('.letter').value||'',
        tr.querySelector('.gp').value||'',
        tr.querySelector('.credit').value||''
      ]);
    });
    const csv = rows.map(r=>r.map(x=>`"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'aiub-simple-cgpa.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }
  window.addRow = addRow; window.clearAll = clearAll; window.recalc = recalc; window.downloadCSV = downloadCSV;
  addRow(); addRow();
  document.addEventListener('input', (e)=>{ if(e.target.closest('#courses')) recalc(); });
  recalc();
})();
