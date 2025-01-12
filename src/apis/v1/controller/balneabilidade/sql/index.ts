import { getQuery } from '../../../../../helpers/getQuery'

const createBalneabilidadeQuery = getQuery(__dirname, 'createBalneabilidadeQuery.sql')
const findLastBalneabilidadeQuery = getQuery(__dirname, 'findLastBalneabilidadeQuery.sql')

export { createBalneabilidadeQuery, findLastBalneabilidadeQuery }
