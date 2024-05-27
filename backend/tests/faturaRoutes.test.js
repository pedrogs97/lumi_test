const request = require('supertest');
const express = require('express');
const path = require('path');
const downloadFaturaRoutes = require('../src/routes/faturaRoutes.js');
const prisma = require('../src/prisma/prismaClient.js');

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => {
          return {
            fatura: {
              findFirst: jest.fn(),
            },
            $disconnect: jest.fn(),
          };
        }),
      };
});

const { mes_para_numero } = require('../src/utils/meses.js');

let app;
let server;

beforeAll((done) => {
  app = express();
   // Middleware para substituir res.download por um mock
   app.use((req, res, next) => {
    res.download = jest.fn((filePath, fileName) => {
      res.status(200).send(`Mock download for file: ${fileName}`);
    });
    next();
  });
  app.use('/api/faturas', downloadFaturaRoutes);
  
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
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/faturas/download', () => {
  it('should return 400 if numero_cliente or mes_referencia is not provided', async () => {
    const response = await request(app).get('/api/faturas/download');

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Nº do cliente e mês de referência são obrigatórios' });
  });

  it('should return 404 if fatura is not found', async () => {
    prisma.fatura.findFirst.mockResolvedValue(null);

    const response = await request(app).get('/api/faturas/download?numero_cliente=123&mes_referencia=MAI');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ message: 'Fatura não encontrada.' });
  });

  it('should return the fatura PDF if fatura is found', async () => {
    const mockFatura = {
      instalacao: '001',
      mes_referencia: 'MAI/2023',
      numero_cliente: '123',
    };
    prisma.fatura.findFirst.mockResolvedValue(mockFatura);

    const filePath = path.join(__dirname, `../../data/Faturas/Instalação_ ${mockFatura.instalacao}`, `${mockFatura.instalacao}-${mes_para_numero['MAI']}-2023.pdf`);
    const response = await request(app).get('/api/faturas/download?numero_cliente=123&mes_referencia=MAI');

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`Mock download for file: 123-MAI.pdf`);
  });
});
