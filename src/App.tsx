import { useState } from "react";
import useSpacetimeDB from "./StDB/useSpacetimeDB";
import AddDataReducer from "./module_bindings/add_data_reducer";
import DataTable from "./module_bindings/data_table";
import useFetchData from "./StDB/useFetchData";
import UpdateRandomDataOneReducer from "./module_bindings/update_random_data_one_reducer";
import UpdateRandomDataTwoReducer from "./module_bindings/update_random_data_two_reducer";

const SPACETIMEDB_HOST_ADDRESS = "wss://testnet.spacetimedb.com";
const SPACETIMEDB_MODULE_NAME = "spacetimedb-ts-bug-demo";

export const App: React.FC = () => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [data, setData] = useState<DataTable[]>();

  useSpacetimeDB(SPACETIMEDB_HOST_ADDRESS, SPACETIMEDB_MODULE_NAME, initialized, setInitialized);
  useFetchData(initialized, setData);

  const updateValues = () => {
    data!.forEach((data: DataTable) => {
      for (let i = 0; i < 10; i++) {
        UpdateRandomDataOneReducer.call(data.id, (Math.random() + 1).toString(36).substring(7));
        UpdateRandomDataTwoReducer.call(data.id, (Math.random() + 1).toString(36).substring(7));
      }
    });
  };

  return (
    <>
      {initialized && data && (
        <>
          <button onClick={() => AddDataReducer.call()}>Add data</button>
          <button onClick={updateValues}>Update data</button>
          <button onClick={() => setData(DataTable.all())}>Refetch data</button>

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
