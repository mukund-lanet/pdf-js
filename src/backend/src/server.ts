import app from "mcr-common/src/expresshelper/expressHelper";
import { init } from "pkg-models-ts/src/config/index";
import { initializeRoutes } from "./routes";

init(false);
initializeRoutes(app);
