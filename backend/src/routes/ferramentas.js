import { Router } from 'express';
import axios from 'axios';
import { autenticar } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../utils/http.js';
import { simularDesenquadramento } from '../services/simulador.js';
import { config } from '../config.js';

export const ferramentasRouter = Router();
ferramentasRouter.use(autenticar);

// GET /api/cnpj/:cnpj  -> consulta dados publicos via BrasilAPI
ferramentasRouter.get('/cnpj/:cnpj', asyncHandler(async (req, res) => {
  const cnpj = String(req.params.cnpj).replace(/\D/g, '');
  if (cnpj.length !== 14) throw new ApiError(400, 'CNPJ deve ter 14 digitos');
  try {
    const { data } = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, { timeout: 8000 });
    res.json({
      cnpj: data.cnpj,
      razaoSocial: data.razao_social,
      nomeFantasia: data.nome_fantasia,
      situacao: data.descricao_situacao_cadastral,
      abertura: data.data_inicio_atividade,
      cnae: String(data.cnae_fiscal),
      cnaeDesc: data.cnae_fiscal_descricao,
      tipo: data.opcao_pelo_mei ? 'MEI' : 'Empresa',
      endereco: [data.logradouro, data.numero, data.bairro, data.municipio, data.uf, data.cep]
        .filter(Boolean).join(', '),
      bruto: data,
    });
  } catch (e) {
    if (e.response?.status === 404) throw new ApiError(404, 'CNPJ nao encontrado');
    throw new ApiError(502, 'Falha ao consultar a BrasilAPI');
  }
}));

// POST /api/simulador  { faturamento, tipo }
ferramentasRouter.post('/simulador', asyncHandler(async (req, res) => {
  const faturamento = Number(req.body?.faturamento);
  if (!Number.isFinite(faturamento) || faturamento < 0) {
    throw new ApiError(422, 'Informe um faturamento valido');
  }
  const tipo = req.body?.tipo || 'Servicos';
  res.json(simularDesenquadramento(faturamento, tipo));
}));

// GET /api/beneficios -> estimativa de carencias previdenciarias do MEI
ferramentasRouter.get('/beneficios', asyncHandler(async (_req, res) => {
  const sm = config.salarioMinimo;
  res.json({
    salarioMinimo: sm,
    contribuicaoMensal: Number((sm * 0.05).toFixed(2)),
    beneficios: [
      { nome: 'Auxilio-doenca', carenciaMeses: 12, valor: sm, observacao: 'Apos 12 contribuicoes mensais' },
      { nome: 'Salario-maternidade', carenciaMeses: 10, valor: sm, observacao: 'Apos 10 contribuicoes mensais' },
      { nome: 'Aposentadoria por idade', carenciaMeses: 180, valor: sm, observacao: '65 anos (h) / 62 anos (m) + 180 contribuicoes' },
      { nome: 'Aposentadoria por invalidez', carenciaMeses: 12, valor: sm, observacao: 'Apos 12 contribuicoes mensais' },
      { nome: 'Pensao por morte', carenciaMeses: 0, valor: sm, observacao: 'Sem carencia para dependentes' },
      { nome: 'Auxilio-reclusao', carenciaMeses: 24, valor: sm, observacao: 'Apos 24 contribuicoes mensais' },
    ],
  });
}));
