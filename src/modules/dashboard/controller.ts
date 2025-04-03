import { SUCCESS_MESSAGES } from '../../utils/messages'
import DashboardService from './service'
const service = DashboardService
const controller = {
  get: async (req: Request | any) => {
    try {
      const data:any = await service.get({
        type: req?.query?.type,
        userId: req?.query?.userId || null
      })
      return data
    } catch (err: any) {
      throw new Error(err)
    }
  },
}
export default controller