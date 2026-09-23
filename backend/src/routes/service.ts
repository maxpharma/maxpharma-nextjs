import Controller from "../modules/services/controller";
const routes = [
  {
    method: "get",
    path: "services",
    controller: Controller.get,
  },
  {
    method: "get",
    path: "services/:id",
    controller: Controller.find,
  },
  {
    method: "post",
    path: "services",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "patch",
    path: "services/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "services/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;