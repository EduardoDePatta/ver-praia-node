import { getQuery } from '../../../../../helpers/getQuery'

const createBalneabilidadeQuery = getQuery(__dirname, 'createBalneabilidadeQuery.sql')
const findLastBalneabilidadeQuery = getQuery(__dirname, 'findLastBalneabilidadeQuery.sql')
const findBalnearioByMunicipioQuery = getQuery(__dirname, 'findBalnearioByMunicipioQuery.sql')
const findMunicipiosQuery = getQuery(__dirname, 'findMunicipiosQuery.sql')
const findBalnearioDetalheByCodigoQuery = getQuery(__dirname, 'findBalnearioDetalheByCodigoQuery.sql')
const findPraiaPropriaMaisProximaQuery = getQuery(__dirname, 'findPraiaPropriaMaisProximaQuery.sql')

export {
  createBalneabilidadeQuery,
  findLastBalneabilidadeQuery,
  findBalnearioByMunicipioQuery,
  findMunicipiosQuery,
  findBalnearioDetalheByCodigoQuery,
  findPraiaPropriaMaisProximaQuery
}
