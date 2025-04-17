import adminRoutes from "./admin";
import applicationRoutes from "./application"
import contactRoutes from "./contact";
import  serviceRoutes from "./service"
import galleryRoutes from "./gallery";
import settingRoutes from "./setting"
import productRoutes from "./product";
import aboutUsRoutes from "./aboutUs"
import dashboardRoutes from "./dashboard"
import { SUCCESS_MESSAGES } from "../utils/messages";
import checkAuthentication from "../middleware/checkAuthentication";
import PopupRoutes from "./popup"

export interface IAuthRequest extends Request {
  query: any;
  params: any;
  body: any;
  user: {
    id: number;
    name: string;
    email: string;
    type: string;
  };
}
export const routes = [
  ...adminRoutes,
  ...applicationRoutes,
  ...contactRoutes,
  ...serviceRoutes,
  ...galleryRoutes,
  ...settingRoutes,
  ...productRoutes,
  ...aboutUsRoutes,
  ...dashboardRoutes,
  ...PopupRoutes
];
export interface IRoute {
  method: "get" | "post" | "put" | "delete" | "patch";
  path: string;
  controller: (req: Request | IAuthRequest) => Promise<void>;
  authorization?: boolean;
  authCheckType?: string[];
}

const routesInit = (app: any) => {
  routes?.forEach((route) => {
    const { method, path, controller, authorization, authCheckType } = route as
      | IRoute
      | any;
    const handleAuthenticationMiddleware = !!authorization
      ? {
          beforeHandle: (req: any) => {
            return checkAuthentication(req, authCheckType);
          },
        }
      : {};

    app[method](
      `api/${path}`,
      async (req: Request | any) => {
        try {
          console.log(req?.path);
          const data = await controller(req);
          return {
            data,
            message: SUCCESS_MESSAGES.SUCCESS,
          };
        } catch (err: any) {
          throw new Error(err);
        }
      },
      handleAuthenticationMiddleware,
    );
  });
};

export default routesInit;