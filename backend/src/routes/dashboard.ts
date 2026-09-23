import DashboardController from '../modules/dashboard/controller'
const chatRoutes = [
  {
    method: 'get',
    path: 'dashboard',
    controller: DashboardController.get,
    authorization: true,
    authCheckType: ['admin'],
  }
]

export default chatRoutes