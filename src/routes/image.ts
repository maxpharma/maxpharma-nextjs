import Controller from "../modules/images/controller";
const routes = [
  {
    method: "get",
    path: "images",
    controller: Controller.get,
    authorization: true,
    authCheckType: ["admin", "user"]
  },
  {
    method: "get",
    path: "images/:id",
    controller: Controller.find,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "post",
    path: "images",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin", "user"]
  },
  {
    method: "patch",
    path: "images/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "images/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;
