import { serve } from "@hono/node-server";
import { Hono } from "hono";
import auth from "./authentication/routes.ts";
import authorizationRouter from "./authorization/routes/index.ts";
import { requestContextMiddleware } from "./shared/middlewares/request-context.middleware.ts";
import { errorHandler } from "./shared/middlewares/errorHandler.ts";

const app = new Hono();

/* GLOBAL MIDDLEWARE */
app.use("*", requestContextMiddleware);

app.get("/", (c) => c.text("Central Auth Service"));

app.route("/auth", auth);
app.route("/authorization", authorizationRouter);

/* GLOBAL ERROR HANDLER */
app.onError(errorHandler);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
