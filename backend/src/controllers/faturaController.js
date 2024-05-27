const path = require('path');
const prisma = require('../prisma/prismaClient.js');
const { mes_para_numero } = require('../utils/meses.js');

const downloadFatura = async (req, res, next) => {
  try {
    const { numero_cliente, mes_referencia } = req.query;

    if (!numero_cliente || !mes_referencia) {
      return res.status(400).json({ error: 'Nº do cliente e mês de referência são obrigatórios' });
    }
    const fatura = await prisma.fatura.findFirst({
      where: {
        numero_cliente: numero_cliente,
        mes_referencia: `${mes_referencia}/2023`
      }
    });

    if (!fatura) {
      return res.status(404).json({ message: 'Fatura não encontrada.' });
    }

    const filePath = path.join(__dirname, `../../data/Faturas/Instalação_ ${fatura.instalacao}`, `${fatura.instalacao}-${mes_para_numero[mes_referencia]}-2023.pdf`);

    res.download(filePath, `${numero_cliente}-${mes_referencia}.pdf`);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  downloadFatura
};