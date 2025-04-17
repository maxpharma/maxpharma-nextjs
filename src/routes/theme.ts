import Controller from "../modules/themes/controller";
const routes = [
  {
    method: "get",
    path: "themes",
    controller: Controller.get,
    authorization: false,
  },
  {
    method: "get",
    path: "themes/:id",
    controller: Controller.find,
    authorization: true,
    authCheckType: ["admin"]
  },
  {
    method: "post",
    path: "themes",
    controller: Controller.create,
  },
  {
    method: "patch",
    path: "themes/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "themes/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;