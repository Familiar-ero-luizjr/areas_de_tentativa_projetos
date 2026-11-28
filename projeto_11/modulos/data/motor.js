registrarModulo('data', {
  renderizarMenu({container, html, css, submodulos, ativo, navegar}) {
    container.innerHTML=html;
    const menu=container.querySelector('.dados-submenu');
    const style=document.createElement('style');style.textContent=css;menu.append(style);
    for(const modulo of submodulos.filter(m=>m.ativo).sort((a,b)=>a.ordem-b.ordem)){
      const button=document.createElement('button');button.type='button';button.textContent=modulo.nome;
      if(modulo.id===ativo){button.className='active';button.setAttribute('aria-current','page');}
      button.onclick=()=>navegar(modulo.id);menu.append(button);
    }
  }
});
