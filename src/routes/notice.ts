import Controller from "../modules/notices/controller";
const routes = [
  {
    method: "get",
    path: "notices",
    controller: Controller.get,
  },
  {
    method: "get",
    path: "notices/:id",
    controller: Controller.find,
  },
  {
    method: "post",
    path: "notices",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin"]
  },
  {
    method: "patch",
    path: "notices/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "notices/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;