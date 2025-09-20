WITH doc AS (
  SELECT response::jsonb AS j
  FROM verpraia.balneabilidade
  ORDER BY id DESC
  LIMIT 1
)
SELECT DISTINCT
  (elem->>'MUNICIPIO')            AS "municipio",
  (elem->>'MUNICIPIO_COD_IBGE')::int AS "codigoMunicipio"
FROM doc, jsonb_array_elements(j) AS elem;
