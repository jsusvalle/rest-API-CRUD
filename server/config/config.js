

//* Puerto

process.env.PORT = process.env.PORT || 3000;

//* Vencimiento del Token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//* Seed de autenticación
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';