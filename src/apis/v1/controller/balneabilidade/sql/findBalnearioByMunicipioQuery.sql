WITH doc AS (
  SELECT response::jsonb AS j
  FROM verpraia.balneabilidade
  ORDER BY id DESC
  LIMIT 1
),
items AS (
  SELECT elem
  FROM doc, jsonb_array_elements(j) AS elem
  WHERE elem->>'MUNICIPIO_COD_IBGE' = $1
),
last_analysis AS (
  SELECT
    (elem->>'CODIGO')::int          AS "codigoBalneario",
    elem->>'BALNEARIO'              AS "balneario",
    elem->>'PONTO_NOME'             AS "pontoNome",
    NULLIF(regexp_replace(elem->>'PONTO_NOME', '[^0-9]', '', 'g'), '')::int
                                     AS "pontoOrd",
    (
      SELECT ar->>'CONDICAO'
      FROM jsonb_array_elements(COALESCE(elem->'ANALISES','[]'::jsonb)) ar
      ORDER BY to_date(ar->>'DATA','DD/MM/YYYY') DESC
      LIMIT 1
    ) AS condicao
  FROM items
)
SELECT
  "codigoBalneario",
  "balneario",
  COALESCE(UPPER("pontoNome"), '') AS "pontoNome",
  (condicao = 'PRÓPRIO')           AS "proprio"
FROM last_analysis
ORDER BY UPPER("balneario") ASC, "pontoOrd" ASC NULLS LAST;
