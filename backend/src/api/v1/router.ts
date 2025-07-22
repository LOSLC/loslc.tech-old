import {Router} from "express"
import {router as helloWorldRouter} from "./controllers/helloWorld"

export const router = Router()
router.use("/hello-world", helloWorldRouter)
