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
