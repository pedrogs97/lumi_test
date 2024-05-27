const prisma = require('../prisma/prismaClient.js');
const { mes_para_numero } = require('../utils/meses.js');

const sortFaturas = (a, b) => {
  const [mesA, anoA] = a.mes_referencia.split('/');
  const [mesB, anoB] = b.mes_referencia.split('/');

  if (anoA < anoB) {
    return -1;
  } else if (anoA > anoB) {
    return 1;
  } else {
    if (mes_para_numero[mesA] < mes_para_numero[mesB]) {
      return -1;
    } else if (mes_para_numero[mesA] > mes_para_numero[mesB]) {
      return 1;
    } else {
      return 0;
    }
  }
}

const getDashboardData = async (req, res, next) => {
  try {
    const { numero_cliente } = req.query;
    if (!numero_cliente) {
      return res.status(400).json({ error: 'Nº do cliente é obrigatório' });
    }

    const faturas = await prisma.fatura.findMany({
      where: {
        numero_cliente: numero_cliente
      }
    });

    const dashboardData = faturas?.sort(sortFaturas)?.map(fatura => ({
      mes_referencia: fatura.mes_referencia,
      consumo_energia_kwh: fatura.energia_eletrica_kwh + fatura.energia_scee_kwh,
      energia_compensada_kwh: fatura.energia_compensada_kwh,
      valor_total_sem_gd: fatura.energia_eletrica_valor + fatura.energia_scee_valor + fatura.contrib_ilum_publica,
      economia_gd: fatura.energia_compensada_valor
    })) ?? [];

    res.json(dashboardData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData
};
