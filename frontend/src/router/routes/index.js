// ** Routes Imports
import { ROLES_APP } from "../../constants/app";
import { getUserData } from "../../utility/Utils";
import AppRoutes from "./Apps";
import PagesRoutes from "./Pages";

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
let DefaultRoute;

const userData = getUserData();
if (userData?.role === ROLES_APP.DEPUTY) {
  DefaultRoute = "/apps/customer/list";
} else if (userData?.role === ROLES_APP.ADMIN) {
  DefaultRoute = "/apps/customer/list";
} else if (userData?.role === ROLES_APP.MANAGER) {
  DefaultRoute = "/apps/customer/list";
} else if (userData?.role === ROLES_APP.STAFF) {
  DefaultRoute = "/apps/customer/list";
} else if (userData?.role === ROLES_APP.PRESIDENT) {
  DefaultRoute = "/apps/customer/list";
} else if (userData?.role === ROLES_APP.VICPRESIDENT) {
  DefaultRoute = "/apps/customer/list";
} else {
  DefaultRoute = "/misc/not-authorized"; // Trả về page k có quyền
}

const Routes = [...AppRoutes, ...PagesRoutes];

export { DefaultRoute, TemplateTitle, Routes };
