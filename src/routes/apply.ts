import Controller from "../modules/apply/controller";
const routes = [
  {
    method: "get",
    path: "applies",
    controller: Controller.get,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "get",
    path: "applies/:id",
    controller: Controller.find,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "post",
    path: "applies",
    controller: Controller.create,
  },
  {
    method: "patch",
    path: "applies/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "applies/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;