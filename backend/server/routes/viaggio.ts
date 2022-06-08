import { Router } from "express";
import { ViaggioCreateModel, ViaggioFilterModel } from "../db/dto/viaggioDto";
import { ViaggioService } from "../db/services/viaggio";
import { validator } from "../validation/utils";
import { viaggioRules } from "../validation/viaggio";
import { errorHandler } from "./utils";

export const routerViaggio = Router();
const service = new ViaggioService();

routerViaggio.post(
  '/create', 
  validator(viaggioRules.forCreate), 
  (req, res, next) => {
    service.create(ViaggioCreateModel.fromDict(req.body))
      .then(results => res.send(results))
      .catch(err => next(err));
  }
)
  
routerViaggio.get(
  '/',
  (req, res, next) => {
    service.getAll(new ViaggioFilterModel(req.query))
      .then(results => res.send(results))
      .catch(err => next(err));
  }
)

routerViaggio.use(errorHandler);