// Executa todos os motores após carregar seus módulos.
wire();
simWire();
restoreSeed();

// Contrato possui fonte própria e nunca grava em catalogo/.
contratoModuloInit();
