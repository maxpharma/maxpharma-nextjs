import { cors } from "@elysiajs/cors";
const corsOptions = cors({
  // origin: [
  //   "http://localhost:8080",
  //   "http://localhost:8081",
  //   "http://localhost:8082",
  //   "http://localhost:3000",
  //   "https://beta.prabhusteel.com",
  // ],
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Api-Key"],
});

export default corsOptions;