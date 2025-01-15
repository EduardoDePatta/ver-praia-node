import { catchAsync } from '../../../../../helpers/catchAsync'
import { HTTP } from '../../../../../helpers/HttpRequest'
import { IMA } from '../../../../../IMA/IMA'
import { executeQuery } from '../../../infra'
import { createBalneabilidadeQuery } from '../sql'

const postBalneabilidade = catchAsync(async (req: HTTP.Req<void, void, void>, tx) => {
  const ima = new IMA()
  const response = await ima.getBalneabilidade()
  const responseJson = JSON.stringify(response)

  await executeQuery({
    query: createBalneabilidadeQuery,
    method: 'none',
    params: [responseJson],
    tx
  })

  return response
}, true)

export { postBalneabilidade }
