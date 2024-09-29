import { useEffect } from "react";
import { SpacetimeDBClient, Identity } from "@clockworklabs/spacetimedb-sdk";
import DataTable from "../module_bindings/data_table";
import UpdateRandomDataOneReducer from "../module_bindings/update_random_data_one_reducer";
import UpdateRandomDataTwoReducer from "../module_bindings/update_random_data_two_reducer";
import AddDataReducer from "../module_bindings/add_data_reducer";
import DeleteAllReducer from "../module_bindings/delete_all_reducer";

const useSpacetimeDB = (
  address: string,
  module: string,
  initialized: boolean,
  setInitialized: Function,
  setClient: Function,
  reconnect?: boolean
) => {
  useEffect(() => {
    if (initialized) return;

    if (!reconnect) {
      SpacetimeDBClient.registerTables(DataTable);
      SpacetimeDBClient.registerReducers(
        AddDataReducer,
        UpdateRandomDataOneReducer,
        UpdateRandomDataTwoReducer,
        DeleteAllReducer
      );
    }

    const client = new SpacetimeDBClient(address, module);

    client?.onConnect((token: string, Identity: Identity) => {
      try {
        console.log("Connected");
        client?.subscribe(["SELECT * FROM DataTable"]);
      } catch (error) {
        console.log("SpacetimeDB connect failed:", error);
      }
    });

    client?.on("initialStateSync", () => {
      setInitialized(true);
    });

    client?.onError((...args: any[]) => {
      console.log("Error with SpacetimeDB: ", args);
    });

    client?.connect();

    setClient(client);
  }, [initialized, setInitialized]);
};

export default useSpacetimeDB;
