
(function(){
  const root = document.body;
  const saved = localStorage.getItem('theme');
  if(saved === 'dark'){ root.classList.add('dark'); }
  function setTheme(mode){
    if(mode==='dark'){ root.classList.add('dark'); } else { root.classList.remove('dark'); }
    localStorage.setItem('theme', mode);
    const label = document.getElementById('themeLabel'); if(label) label.textContent = (mode==='dark'?'Dark':'Light')+' Mode';
  }
  window.toggleTheme = function(){
    const isDark = root.classList.contains('dark'); setTheme(isDark?'light':'dark');
  }
})();
