import Controller from "../modules/popup/controller";
const routes = [
  {
    method: "get",
    path: "popup",
    controller: Controller.get,
  },
  {
    method: "get",
    path: "popup/:id",
    controller: Controller.find,
  },
  {
    method: "post",
    path: "popup",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin"]
  },
  {
    method: "patch",
    path: "popup/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "popup/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;