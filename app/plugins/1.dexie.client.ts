import type {
  DBCore,
  DBCoreMutateRequest,
  DBCoreMutateResponse,
  Table,
} from "dexie";
import Dexie from "dexie";

export default defineNuxtPlugin(() => {
  class Database extends Dexie {
    events!: Table<NostrEvent, string>;

    constructor() {
      super("inbox");
      this.version(1).stores({
        events: "++id, kind,content, created_at, tags ,pubkey,status",
      });

      this.use({
        stack: "dbcore",
        name: "syncMiddleware",
        create: (downlevelDatabase: DBCore) => {
          return {
            ...downlevelDatabase,
            table: (tableName: string) => {
              const downlevelTable = downlevelDatabase.table(tableName);
              return {
                ...downlevelTable,
                mutate: async (req: DBCoreMutateRequest) => {
                  const result: DBCoreMutateResponse =
                    await downlevelTable.mutate(req);

                  if (req.type === "add" && tableName === "events") {
                    const events = req.values as NostrEvent[];
                    for (const event of events) {
                      if (event.status === "Sending") {
                        try {
                          // const { $sendEVENTMessage } = useNuxtApp();
                          // $sendEVENTMessage(event);
                          console.log("send");
                        } catch (error) {
                          console.error("Error syncing event:", error);
                        }
                      }
                    }
                  }

                  return result;
                },
              };
            },
          };
        },
      });
    }

    // Wipe all data in the database and reload the database schema
    async wipeDataOnLogout() {
      try {
        // Clear all tables in the database
        await this.delete();

        // Reinitialize the database
        this.version(1).stores({
          events: "++id, kind,content, created_at, tags ,pubkey,status",
        });
        console.log("Database wiped and reinitialized on logout.");
      } catch (error) {
        console.error("Error wiping database on logout:", error);
      }
    }
  }

  const dexie = new Database();

  // Provide the dexie instance to the app and add the logout wipe functionality
  return {
    provide: {
      dexie,
      wipeDexie: dexie.wipeDataOnLogout.bind(dexie),
    },
  };
});
