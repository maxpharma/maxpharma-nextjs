import Controller from "../modules/portfolios/controller";
const routes = [
  {
    method: "get",
    path: "portfolios",
    controller: Controller.get,

  },
  {
    method: "get",
    path: "portfolios/:id",
    controller: Controller.find,

  },
  {
    method: "post",
    path: "portfolios",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin"]
  },
  {
    method: "patch",
    path: "portfolios/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "portfolios/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;