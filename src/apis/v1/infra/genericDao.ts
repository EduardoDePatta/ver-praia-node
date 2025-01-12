import db from '../../../db'

type Schemas = 'verpraia'
type Tables = 'balneabilidade'

interface TableMap {
  balneabilidade: any
}

interface InsertParams<T extends Tables> {
  schema: Schemas
  tableName: T
  data: Omit<Partial<TableMap[T]>, 'id'>
}

type QueryMethod = 'manyOrNone' | 'one' | 'none' | 'any' | 'oneOrNone' | 'many'

interface ExecuteQueryParams {
  query: string
  params?: Record<string, any>
  method: QueryMethod
  tx?: any
}

async function insertIntoTable<T extends Tables>({ schema, tableName, data }: InsertParams<T>, tx?: any): Promise<TableMap[T]> {
  try {
    const fullTableName = `${schema}.${tableName}`
    const fields = Object.keys(data)
      .map((field) => `"${field}"`)
      .join(', ')
    const placeholders = Object.keys(data)
      .map((_, index) => `$${index + 1}`)
      .join(', ')
    const values = Object.values(data)

    const query = `INSERT INTO ${fullTableName} (${fields}) VALUES (${placeholders}) RETURNING *`

    const insertedRow = tx ? await tx.one(query, values) : await db.one(query, values)
    return insertedRow as TableMap[T]
  } catch (error) {
    throw error
  }
}

const executeQuery = async <T>({ query, params, method, tx }: ExecuteQueryParams): Promise<T> => {
  try {
    const dbMethod = tx ? tx[method] : db[method]
    return await dbMethod(query, params)
  } catch (error) {
    throw error
  }
}

export { insertIntoTable, executeQuery }
