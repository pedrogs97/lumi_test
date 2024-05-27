const request = require('supertest');
const express = require('express');
const dashboardRoutes = require('../src/routes/dashboardRoutes.js');
const prisma = require('../src/prisma/prismaClient.js');

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        fatura: {
          findMany: jest.fn(),
        },
        $disconnect: jest.fn(),
      };
    }),
  };
});


let app;
let server;

beforeAll((done) => {
  app = express();
  app.use(express.json());
  app.use('/api/dashboard', dashboardRoutes);

  server = app.listen(4000, () => {
    console.log('Test server running on port 4000');
    done();
  });
});

afterAll(async () => {
  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
  await prisma.$disconnect();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/dashboard', () => {
  it('should return dashboard data for a specific cliente', async () => {
    const mockData = [
      {
        mes_referencia: 'MAI/2023',
        energia_eletrica_kwh: 100,
        energia_scee_kwh: 50,
        energia_compensada_kwh: 20,
        energia_eletrica_valor: 50,
        energia_scee_valor: 20,
        contrib_ilum_publica: 10,
        energia_compensada_valor: 10,
        numero_cliente: '123',
        instalacao: '123456'
      },
      {
        mes_referencia: 'JUN/2023',
        energia_eletrica_kwh: 200,
        energia_scee_kwh: 100,
        energia_compensada_kwh: 40,
        energia_eletrica_valor: 100,
        energia_scee_valor: 40,
        contrib_ilum_publica: 20,
        energia_compensada_valor: 20,
        numero_cliente: '123',
        instalacao: '123456'
      },
    ];

    prisma.fatura.findMany.mockResolvedValue(mockData);

    const response = await request(app).get('/api/dashboard/?numero_cliente=123');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        mes_referencia: 'MAI/2023',
        consumo_energia_kwh: 150,
        energia_compensada_kwh: 20,
        valor_total_sem_gd: 80,
        economia_gd: 10,
      },
      {
        mes_referencia: 'JUN/2023',
        consumo_energia_kwh: 300,
        energia_compensada_kwh: 40,
        valor_total_sem_gd: 160,
        economia_gd: 20,
      },
    ]);
  });

  it('should return 400 if numero_cliente is not provided', async () => {
    const response = await request(app).get('/api/dashboard/');

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Nº do cliente é obrigatório' });
  });
});
