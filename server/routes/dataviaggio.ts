import { Router } from "express";
import { DataViaggioCreateModel } from "../db/dto/dataviaggio";
import { DataViaggioService } from "../db/services/dataviaggio";
import { dataViaggioRules } from "../validation/dataviaggio";
import { validator } from "../validation/utils";
import { errorHandler } from "./utils";

export const routerDataViaggio = Router();
const service = new DataViaggioService();

routerDataViaggio.post(
  '/create', 
  validator(dataViaggioRules.forCreate), 
  (req, res, next) => {
    let dto = req.body as DataViaggioCreateModel;
    service.create(dto)
      .then(results => res.send(results))
      .catch(err => next(err));
  }
)

routerDataViaggio.get(
  '/',
  (req, res, next) => {
    let filter = req.query as Record<string, any>;
    if ('IdCliente' in filter) {
      filter.IdCliente = Number(filter.IdCliente);
    }
    service.getAll(filter)
      .then(results => res.send(results))
      .catch(err => next(err));
  }
)

routerDataViaggio.use(errorHandler);