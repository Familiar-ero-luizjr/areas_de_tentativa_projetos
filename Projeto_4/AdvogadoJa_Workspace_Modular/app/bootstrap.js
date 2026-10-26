// Executa todos os motores após carregar seus módulos.
wire();
if(typeof protWire==='function')protWire();
restoreSeed();

// Contrato possui fonte própria e nunca grava em catalogo/.
contratoModuloInit();
