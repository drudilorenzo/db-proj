import { ClienteFilterModel, ClienteCreateModel } from "../dto/cliente";
import { BaseService } from "./base";

export class ClienteService extends BaseService {
  register(data: ClienteCreateModel) {
    return this._prisma.cliente.create({
      data: {
        Nome: data.nome,
        Cognome: data.cognome,
        Email: data.email,
        DataNascita: data.dataNascita.toISOString()
      }
    });
  }

  getAll(filter: ClienteFilterModel) {
    return this._prisma.cliente.findMany({
      where: filter.getFilterDict()
    });
  }
}