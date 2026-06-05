import { Router } from 'express';
import { many, one } from '../db.js';
import { autenticar } from '../middleware/auth.js';
import { asyncHandler } from '../utils/http.js';
import { config } from '../config.js';

export const financeiroRouter = Router();
financeiroRouter.use(autenticar);

financeiroRouter.get('/resumo', asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const serie = await many(
    `with meses as (
        select to_char(d, 'YYYY-MM') as ym,
               to_char(d, 'TMMon')   as rotulo
          from generate_series(date_trunc('month', now()) - interval '11 months',
                               date_trunc('month', now()),
                               interval '1 month') d
     )
     select m.ym,
            m.rotulo as mes,
            coalesce(sum(l.valor) filter (where l.tipo = 'receita'), 0) as receita,
            coalesce(sum(l.valor) filter (where l.tipo = 'despesa'), 0) as despesa
       from meses m
       left join lancamentos l
         on l.user_id = $1 and to_char(l.data, 'YYYY-MM') = m.ym
      group by m.ym, m.rotulo
      order by m.ym`,
    [userId]
  );

  const faturamentoMensal = serie.map((r) => ({ mes: r.mes, valor: Number(r.receita) }));
  const faturamentoAnual = faturamentoMensal.reduce((s, x) => s + x.valor, 0);
  const percentTeto = Math.min(100, Number(((faturamentoAnual / config.tetoMEI) * 100).toFixed(1)));

  const mes = await one(
    `select coalesce(sum(valor) filter (where tipo='receita'),0) as receita,
            coalesce(sum(valor) filter (where tipo='despesa'),0) as despesa
       from lancamentos
      where user_id=$1 and date_trunc('month', data) = date_trunc('month', now())`,
    [userId]
  );

  const porCategoria = await many(
    `select categoria, coalesce(sum(valor),0) as total
       from lancamentos
      where user_id=$1 and tipo='despesa'
        and date_trunc('year', data) = date_trunc('year', now())
      group by categoria order by total desc`,
    [userId]
  );

  const receitaMes = Number(mes.receita);
  const despesaMes = Number(mes.despesa);

  res.json({
    teto: config.tetoMEI,
    faturamentoMensal,
    faturamentoAnual,
    percentTeto,
    restanteTeto: Math.max(0, config.tetoMEI - faturamentoAnual),
    mesCorrente: {
      receita: receitaMes,
      despesa: despesaMes,
      saldo: Number((receitaMes - despesaMes).toFixed(2)),
    },
    despesasPorCategoria: porCategoria.map((c) => ({ categoria: c.categoria, total: Number(c.total) })),
  });
}));
