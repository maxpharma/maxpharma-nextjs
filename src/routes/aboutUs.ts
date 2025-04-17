import Controller from "../modules/aboutUs/controller";
const routes = [
  {
    method: "get",
    path: "about-us",
    controller: Controller.get,

  },
  {
    method: "get",
    path: "about-us/:id",
    controller: Controller.find,

  },
  {
    method: "post",
    path: "about-us",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin"]
  },
  {
    method: "patch",
    path: "about-us/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "about-us/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;