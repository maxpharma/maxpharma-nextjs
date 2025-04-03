import Controller from "../modules/galleries/controller";
const routes = [
  {
    method: "get",
    path: "gallery",
    controller: Controller.get,
  },
  {
    method: "get",
    path: "gallery/:id",
    controller: Controller.find,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "post",
    path: "gallery",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin", "user"]
  },
  {
    method: "patch",
    path: "gallery/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "gallery/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;