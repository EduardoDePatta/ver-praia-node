CREATE TABLE balneabilidade (
    id SERIAL PRIMARY KEY,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_balneabilidade
BEFORE UPDATE ON balneabilidade
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE OR REPLACE FUNCTION verpraia.find_praia_propria_mais_proxima(
  p_cod_ibge text,
  p_user_lat double precision,
  p_user_lon double precision,
  p_raio_m   double precision DEFAULT NULL
)
RETURNS TABLE(
  "codigoBalneario" int,
  "balneario"       text,
  "pontoNome"       text,
  lat               double precision,
  lon               double precision,
  "distancia_m"     int
)
LANGUAGE sql STABLE AS $$
WITH doc AS (
  SELECT response::jsonb AS j
  FROM verpraia.balneabilidade
  ORDER BY id DESC
  LIMIT 1
),
items AS (
  SELECT elem
  FROM doc, jsonb_array_elements(j) AS elem
  WHERE elem->>'MUNICIPIO_COD_IBGE' = p_cod_ibge
),
last_analysis AS (
  SELECT
    (elem->>'CODIGO')::int AS codigo_balneario,
    elem->>'BALNEARIO'     AS balneario,
    elem->>'PONTO_NOME'    AS ponto_nome,
    NULLIF(regexp_replace(elem->>'PONTO_NOME','[^0-9]','','g'),'')::int AS ponto_ord,
    (elem->>'LATITUDE')::float8  AS lat,
    (elem->>'LONGITUDE')::float8 AS lon,
    (
      SELECT ar->>'CONDICAO'
      FROM jsonb_array_elements(COALESCE(elem->'ANALISES','[]'::jsonb)) ar
      ORDER BY to_date(ar->>'DATA','DD/MM/YYYY') DESC
      LIMIT 1
    ) AS condicao
  FROM items
),
candidatos AS (
  SELECT
    codigo_balneario, balneario, ponto_nome, ponto_ord, lat, lon,
    ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography AS geog
  FROM last_analysis
  WHERE upper(unaccent(condicao)) LIKE 'PROPRIO%'
)
SELECT
  c.codigo_balneario              AS "codigoBalneario",
  c.balneario                     AS "balneario",
  COALESCE(UPPER(c.ponto_nome),'') AS "pontoNome",
  c.lat, c.lon,
  ST_Distance(
    c.geog,
    ST_SetSRID(ST_MakePoint(p_user_lon, p_user_lat), 4326)::geography
  )::int AS "distancia_m"
FROM candidatos c
WHERE p_raio_m IS NULL
   OR ST_DWithin(
        c.geog,
        ST_SetSRID(ST_MakePoint(p_user_lon, p_user_lat),4326)::geography,
        p_raio_m
      )
ORDER BY "distancia_m" ASC, UPPER(c.balneario), c.ponto_ord NULLS LAST
LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION verpraia.find_praia_propria_mais_proxima(text,double precision,double precision,double precision) TO admin;


-- SELECT * FROM verpraia.find_praia_propria_mais_proxima('4205407', -27.59, -48.55, 50000);


