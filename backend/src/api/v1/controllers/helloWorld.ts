import {Router} from "express"
import { helloWorld } from "../providers/helloWorld"

export const router = Router()


router.get("/", async (_, res) => {
  const response = await helloWorld()
  res.send(response)
})
