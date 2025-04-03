import Controller from "../modules/contacts/controller";
const routes = [
  {
    method: "get",
    path: "contacts",
    controller: Controller.get,
    authorization: true,
    authCheckType: ["admin", "user"]
  },
  {
    method: "post",
    path: "contacts",
    controller: Controller.create,
  },
  {
    method: "delete",
    path: "contacts/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin", "user"],
  },
];

export default routes;