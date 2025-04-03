import Controller from "../modules/applications/controller";
const routes = [
  {
    method: "get",
    path: "applications",
    controller: Controller.get,
    authorization: true,
    authCheckType: ["admin", "user"]
  },
  {
    method: "get",
    path: "applications/:id",
    controller: Controller.find,
    authorization: true,
    authCheckType: ["admin", "user"]
  },
  {
    method: "post",
    path: "applications",
    controller: Controller.create,
  },
  {
    method: "patch",
    path: "applications/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin", "user"],
  },
  {
    method: "delete",
    path: "applications/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin", "user"],
  },
];

export default routes;