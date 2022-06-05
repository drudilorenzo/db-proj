import { DataViaggioCreateModel } from "../dto/dataviaggio";
import { BaseService } from "./base";

export class DataViaggioService extends BaseService {
  create(data: DataViaggioCreateModel) {
    return this._prisma.dataViaggio.create({
      data: {
        DataPartenza: new Date(data.dataPartenza),
        Posti: data.posti,
        PrezzoBase: data.prezzoBase,
        Sconto: {
          connectOrCreate: {
            where: {
              Percentuale: data.sconto
            },
            create: {
              Percentuale: data.sconto
            }
          }
        },
        Guida: {
          connect: { IdGuida: data.idGuida }
        },
        Viaggio: {
          connect: { IdViaggio: data.idViaggio }
        }
      }
    });
  }
  
  getAll(filter: Record<string, any> = {}) {
    return this._prisma.dataViaggio.findMany({
      where: filter,
      include: {
        Viaggio: true,
        Sconto: true,
        Guida: true
      }
    })
    .then(results => {
      return results.map(result => ({
        descrizione: result.Viaggio.Descrizione,
        dataPartenza: result.DataPartenza,
        posti: result.Posti,
        sconto: result.Sconto.Percentuale,
        guida: result.Guida.Email,
        prezzoBase: result.PrezzoBase
      }));
    });
  }

  async countPostiRimasti(idDataViaggio: number) {
    let prenotazioni = await this._prisma.dataViaggio.findMany({
      where: {
        IdDataViaggio: idDataViaggio,
      },
      select: {
        _count: {
          select: {
            Prenotazioni: true
          }
        }
      }  
    })
    .then(results => results[0]._count.Prenotazioni);
    return this._prisma.dataViaggio.findUnique({
      where: {
        IdDataViaggio: idDataViaggio
      },
      select: {
        Posti: true
      }
    }).then(result => result.Posti - prenotazioni);
  }

  getPrezzo(idDataViaggio: number) {
    return this._prisma.dataViaggio.findUnique({
      where: {
        IdDataViaggio: idDataViaggio
      },
      select: {
        PrezzoBase: true,
        Sconto: true
      }
    }).then(result => 
      result.PrezzoBase.toNumber() * (1 - ((result?.Sconto.Percentuale) ?? 0) / 100));
  }
}