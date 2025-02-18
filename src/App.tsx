import { useState } from "react";
import useSpacetimeDB from "./StDB/useSpacetimeDB";
import AddDataReducer from "./module_bindings/add_data_reducer";
import DataTable from "./module_bindings/data_table";
import useFetchData from "./StDB/useFetchData";
import UpdateRandomDataOneReducer from "./module_bindings/update_random_data_one_reducer";
import UpdateRandomDataTwoReducer from "./module_bindings/update_random_data_two_reducer";
import DeleteAllReducer from "./module_bindings/delete_all_reducer";
import { SpacetimeDBClient } from "@clockworklabs/spacetimedb-sdk";

const SPACETIMEDB_HOST_ADDRESS = "wss://pglybe.dungeontalk.live/";
const SPACETIMEDB_MODULE_NAME = "spacetime-logout-test";

export const App: React.FC = () => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [data, setData] = useState<DataTable[]>();
  const [client, setClient] = useState<SpacetimeDBClient | null>();

  useSpacetimeDB(SPACETIMEDB_HOST_ADDRESS, SPACETIMEDB_MODULE_NAME, initialized, setInitialized, setClient, false);
  useFetchData(initialized, setData);

  const updateValues = () => {
    data!.forEach((data: DataTable) => {
      for (let i = 0; i < 10; i++) {
        UpdateRandomDataOneReducer.call(data.id, (Math.random() + 1).toString(36).substring(7));
        UpdateRandomDataTwoReducer.call(data.id, (Math.random() + 1).toString(36).substring(7));
      }
    });
  };

  const deleteAll = () => {
    const data = DataTable.all();

    data.forEach((element) => {
      DeleteAllReducer.call(element.id);
    });
  };

  const disconnect = () => {
    if (!client) return;

    client?.disconnect();
    setClient(null);
    console.log("Disconnected!");
  };

  const reconnect = () => {
    setInitialized(false);
  };

  return (
    <>
      {initialized && data && (
        <>
          <div>
            <button onClick={() => AddDataReducer.call()}>Add data</button>
            <button onClick={updateValues}>Update data</button>
            <button onClick={() => setData(DataTable.all())}>Refetch data</button>
            <button onClick={() => deleteAll()}>Delete all</button>
          </div>

          <div>
            <button onClick={() => reconnect()}>Login</button>
            <button onClick={() => disconnect()}>Logout</button>
          </div>

          <div>
            {data?.map((d: DataTable) => {
              return (
                <div key={d.id} style={{ borderStyle: "groove", maxWidth: "200px", margin: "10px" }}>
                  <p>ID: {d.id}</p>
                  <p>One: {d.randomDataOne}</p>
                  <p>Two: {d.randomDataTwo}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};
