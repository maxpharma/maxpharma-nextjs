import Controller from "../modules/documents/controller";
const routes = [
  {
    method: "get",
    path: "documents",
    controller: Controller.get,
  },
  {
    method: "post",
    path: "documents",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "patch",
    path: "documents/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "documents/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;