import Controller from "../modules/admins/controller";
const routes = [
  {
    method: "post",
    path: "admins/register",
    controller: Controller.register,
    // authorization: true,
    // authCheckType: ["admin"],
  },
  {
    method: "get",
    path: "admins/:id",
    controller: Controller.find,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "patch",
    path: "admins/change-password",
    controller: Controller.changePassword,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "post",
    path: "admins/login",
    controller: Controller.login,
  },
  {
    method: "get",
    path: "admins",
    controller: Controller.get,
    authorization: true,
    authCheckType: ["admin"],
  },
  {
    method: "post",
    path: "admins/logout",
    controller: Controller.logout,
    authorization: true,
    authCheckType: ["admin"],
  },
];

export default routes;