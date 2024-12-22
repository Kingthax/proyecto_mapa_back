const request = require('supertest');
const app = require('../server'); // Importa la app desde server.js
const db = require('../db/connections'); // Mock de la base de datos

jest.mock('../db/connections', () => ({
  query: jest.fn((query, values, callback) => {
    callback(null, []); // Devuelve un resultado vacío
  }),
  connect: jest.fn(),
  end: jest.fn(),
}));

describe('Rutas de citas', () => {
  let server;

  beforeAll(() => {
    // Inicia el servidor en un puerto específico para las pruebas
    server = app.listen(4000, () => {
      console.log('Servidor de pruebas iniciado en el puerto 4000');
    });
  });

  afterAll((done) => {
    // Cierra el servidor al final de las pruebas
    server.close(done); // Usa un callback para asegurarte de que el servidor se cierra correctamente
  });

  afterEach(() => {
    // Limpia los mocks después de cada prueba
    jest.clearAllMocks();
  });

  it('GET /api/citas - debería devolver todas las citas', async () => {
    const mockResults = [
      { idCitas: 1, idUsuario: 1, idgasfiter: 1, Fecha: '2023', Estado: 4, calificacion: 7 },
      { idCitas: 2, idUsuario: 2, idgasfiter: 2, Fecha: '2023', Estado: 7, calificacion: 9 },
    ];

    db.query.mockImplementation((query, callback) => {
      callback(null, mockResults); // Simula la respuesta de la base de datos
    });

    const response = await request(app).get('/api/citas');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResults);
  });

  it('POST /api/citas - debería crear una nueva cita', async () => {
    const newCita = {
      idUsuario: 1,
      idgasfiter: 2,
      Fecha: '2023',
      Estado: 5,
      calificacion: 8,
    };

    db.query.mockImplementation((query, values, callback) => {
      callback(null, { insertId: 123 }); // Simula una inserción exitosa
    });

    const response = await request(app).post('/api/citas').send(newCita);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Cita creada exitosamente',
      citaId: 123,
    });
  });

  it('POST /api/citas - debería devolver error 500 si la base de datos falla', async () => {
    const newCita = {
      idUsuario: 1,
      idgasfiter: 2,
      Fecha: '2023',
      Estado: 5,
      calificacion: 8,
    };

    db.query.mockImplementation((query, values, callback) => {
      callback(new Error('Database error'), null); // Simula un error de la base de datos
    });

    const response = await request(app).post('/api/citas').send(newCita);

    expect(response.status).toBe(500);

  });
});