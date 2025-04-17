import Controller from "../modules/inquiries/controller";
const routes = [
  {
    method: "get",
    path: "inquiries",
    controller: Controller.get,
    authorization: true,
    authCheckType: ["admin"]
  },
  {
    method: "get",
    path: "inquiries/:id",
    controller: Controller.find,
  },
  {
    method: "post",
    path: "inquiries",
    controller: Controller.create,

  },
  {
    method: "delete",
    path: "inquiries/:id",
    controller: Controller.delete,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;