import Controller from "../modules/products/controller";
const routes = [
  {
    method: "get",
    path: "products",
    controller: Controller.get,
  },
  {
    method: "get",
    path: "products/:id",
    controller: Controller.find,
  },
  {
    method: "post",
    path: "products",
    controller: Controller.create,
    authorization: true,
    authCheckType: ["admin"]
  },
  {
    method: "patch",
    path: "products/:id",
    controller: Controller.update,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "delete",
    path: "products/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;