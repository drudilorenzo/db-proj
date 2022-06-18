import { DataViaggioCreateModel, DataViaggioFilterModel } from "../dto/dataviaggio";
import { BaseService } from "./base";

export class DataViaggioService extends BaseService {
  create(data: DataViaggioCreateModel) {
    return this._prisma.$transaction(async prisma => {
      let viaggiGuida = await prisma.dataViaggio.findMany({
        where: { IdGuida: data.idGuida },
        include: {
          Viaggio: {
            include: {
              Giornate: true
            }
          }
        }
      }).then(results => results.map(res => {
        let fine = new Date(res.DataPartenza.valueOf());
        fine.setDate(fine.getDate() + res.Viaggio.Giornate.length);
        return {
          dataInizio: res.DataPartenza,
          dataFine: fine
        };
      }));

      let viaggio = await prisma.viaggio.findUnique({
        where: { IdViaggio: data.idViaggio },
        include: {
          Giornate: true
        }
      });

      let inizio = data.dataPartenza;
      let fine = new Date(data.dataPartenza.valueOf());
      fine.setDate(fine.getDate() + viaggio.Giornate.length);

      let valid = viaggiGuida.every(dv => !((inizio <= dv.dataInizio && dv.dataInizio <= fine) || (dv.dataInizio <= inizio && inizio <= dv.dataFine)));

      if (!valid) {
        throw new Error("Sovrapposizioni");
      }

      return prisma.dataViaggio.create({
        data: {
          DataPartenza: data.dataPartenza,
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
    })
  }
  
  getAll(filter: DataViaggioFilterModel) {
    return this._prisma.dataViaggio.findMany({
      where: filter.getFilterDict(),
      include: {
        Viaggio: true,
        Sconto: true,
        Guida: true
      }
    })
    .then(results => {
      return results.map(result => ({
        idDataViaggio: result.IdDataViaggio,  
        idViaggio: result.IdViaggio,
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

  async getDataInizioEDataFine(idDataViaggio: number) {
    let data = await this._prisma.dataViaggio.findUnique({
      where: {
        IdDataViaggio: idDataViaggio
      },
      select: {
        DataPartenza: true,
        Viaggio: {
          select: {
            Giornate: true
          }
        }
      }
    });

    let result = data.DataPartenza;
    result.setDate(result.getDate() + data.Viaggio.Giornate.length);
    return {
      inizio: data.DataPartenza,
      fine: result
    };
  }
}