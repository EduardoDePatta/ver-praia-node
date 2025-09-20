WITH doc AS (
  SELECT response::jsonb AS j
  FROM verpraia.balneabilidade
  ORDER BY id DESC
  LIMIT 1
),
item AS (
  SELECT elem
  FROM doc, jsonb_array_elements(j) AS elem
  WHERE elem->>'CODIGO' = $1
  LIMIT 1
),
base AS (
  SELECT
    elem->>'CODIGO'                    AS "codigo",
    elem->>'BALNEARIO'                 AS "balneario",
    elem->>'MUNICIPIO'                 AS "municipio",
    (elem->>'MUNICIPIO_COD_IBGE')::int AS "codigoMunicipio",
    elem->>'PONTO_NOME'                AS "pontoNome",
    elem->>'LOCALIZACAO'               AS "localizacao",
    NULLIF(elem->>'LATITUDE','')::numeric  AS "latitude",
    NULLIF(elem->>'LONGITUDE','')::numeric AS "longitude"
  FROM item
)
SELECT
  b."codigo",
  b."balneario",
  b."municipio",
  b."codigoMunicipio",
  b."pontoNome",
  b."localizacao",
  b."latitude",
  b."longitude",
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'dataBr',    ar->>'DATA',
        'dataISO',   to_char(to_date(ar->>'DATA','DD/MM/YYYY'),'YYYY-MM-DD"T"00:00:00.000"Z"'),
        'chuva',     ar->>'CHUVA',
        'condicao',  ar->>'CONDICAO',
        'resultado', CASE WHEN (ar->>'RESULTADO') ~ '^\d+(\.\d+)?$' THEN (ar->>'RESULTADO')::numeric ELSE NULL END,
        'proprio',   CASE upper(ar->>'CONDICAO') WHEN 'PRÓPRIO' THEN true WHEN 'IMPRÓPRIO' THEN false ELSE NULL END
      )
    ORDER BY to_date(ar->>'DATA','DD/MM/YYYY') DESC)
    FROM item, jsonb_array_elements(item.elem->'ANALISES') ar
  ) AS "analises",
  (
    SELECT jsonb_build_object(
      'dataBr',    ar->>'DATA',
      'dataISO',   to_char(to_date(ar->>'DATA','DD/MM/YYYY'),'YYYY-MM-DD"T"00:00:00.000"Z"'),
      'chuva',     ar->>'CHUVA',
      'condicao',  ar->>'CONDICAO',
      'resultado', CASE WHEN (ar->>'RESULTADO') ~ '^\d+(\.\d+)?$' THEN (ar->>'RESULTADO')::numeric ELSE NULL END,
      'proprio',   CASE upper(ar->>'CONDICAO') WHEN 'PRÓPRIO' THEN true WHEN 'IMPRÓPRIO' THEN false ELSE NULL END
    )
    FROM item, jsonb_array_elements(item.elem->'ANALISES') ar
    ORDER BY to_date(ar->>'DATA','DD/MM/YYYY') DESC
    LIMIT 1
  ) AS "ultimaAnalise"
FROM base b;
