export function projetar(c){const operacoes=[],entidades=[],referencias=[];
for(const [id,t] of Object.entries(c.telas)){for(const o of t.dados?.operacoes||[])operacoes.push({tela:id,...o});for(const ent of t.dados?.persistencia||[])entidades.push({tela:id,...ent});for(const f of t.dados?.fontes||[])referencias.push({tela:id,...f})}
return {fonte:'dados dos 5 JSONs de tela',operacoes,entidades,referencias,avisos:entidades.length?[]:['Não há entidades detalhadas suficientes para projetar tabelas. O motor não inventa esquema.'],quantidadeTelas:Object.keys(c.telas).length};}
