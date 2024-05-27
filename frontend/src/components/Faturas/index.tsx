import React, { useState } from 'react';
import { ENVIRONMENT } from '../../constants/env'

const Faturas: React.FC = () => {
  const [numeroCliente, setNumeroCliente] = useState<string>('');
  const [mesReferencia, setMesReferencia] = useState<string>('');

  const handleDownload = () => {
    if (numeroCliente && mesReferencia) {
      const url = `${ENVIRONMENT.baseURL}/faturas/download?numero_cliente=${numeroCliente}&mes_referencia=${mesReferencia}`;
      window.open(url, '_blank');
    } else {
      alert('Por favor, preencha ambos os campos.');
    }
  };

  const mesesDoAno = [
    { label: 'Janeiro', value: 'JAN' },
    { label: 'Fevereiro', value: 'FEV' },
    { label: 'Março', value: 'MAR' },
    { label: 'Abril', value: 'ABR' },
    { label: 'Maio', value: 'MAI' },
    { label: 'Junho', value: 'JUN' },
    { label: 'Julho', value: 'JUL'},
    { label: 'Agosto', value: 'AGO' },
    { label: 'Setembro', value: 'SET' },
    { label: 'Outubro', value: 'OUT' },
    { label: 'Novembro', value: 'NOV' },
    { label: 'Dezembro', value: 'DEZ' }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Biblioteca de Faturas</h1>
      <input
        type="text"
        value={numeroCliente}
        onChange={e => setNumeroCliente(e.target.value)}
        placeholder="Nº do Cliente"
        className="border border-gray-300 p-2 mb-4 w-full"
      />
      <select
        value={mesReferencia}
        onChange={e => setMesReferencia(e.target.value)}
        className="border border-gray-300 p-2 mb-4 w-full"
      >
        <option value="">Selecione o Mês de Referência</option>
        {mesesDoAno.map(mes => (
          <option key={mes.value} value={mes.value}>
            {mes.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleDownload}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Download Fatura
      </button>
    </div>
  );
}

export default Faturas;