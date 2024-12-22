console.log('Mock de conexiones cargado'); // Agrega esto para confirmar

module.exports = {
  query: jest.fn((query, values, callback) => {
    callback(null, []); // Devuelve un resultado vacío
  }),
  connect: jest.fn(),
  end: jest.fn(),
};
