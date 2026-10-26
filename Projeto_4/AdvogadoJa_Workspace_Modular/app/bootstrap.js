// Executa todos os motores após carregar seus módulos.
wire();
if(typeof protWire==='function')protWire();
if(typeof mdlWire==='function')mdlWire();
if(typeof jioWire==='function')jioWire();
restoreSeed();

// Contrato possui fonte própria e nunca grava em catalogo/.
contratoModuloInit();
