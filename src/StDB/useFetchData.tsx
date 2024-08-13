import { useEffect } from "react";
import DataTable from "../module_bindings/data_table";

const useFetchData = (initialized: boolean | undefined, setData: Function) => {
  useEffect(() => {
    if (!initialized) return;

    const data = DataTable.all();

    setData(data);
  }, [initialized]);
};

export default useFetchData;
