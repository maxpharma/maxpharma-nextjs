import Controller from "../modules/teams/controller";
const routes = [
  {
    method: "get",
    path: "teams",
    controller: Controller.get,
  },
  {
    method: "get",
    path: "teams/:id",
    controller: Controller.find,
  },
  {
    method: "post",
    path: "teams",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin"]
  },
  {
    method: "patch",
    path: "teams/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "teams/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;