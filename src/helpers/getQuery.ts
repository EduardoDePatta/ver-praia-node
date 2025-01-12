import path from 'path'
import fs from 'fs'

const getQuery = (directory: string, filename: string): string => {
  const filePath = path.join(directory, filename)
  const content = fs.readFileSync(filePath, 'utf-8')
  return content
}

export { getQuery }