using SpacetimeDB;
using static SpacetimeDB.Runtime;

static partial class Module
{
    [SpacetimeDB.Reducer(ReducerKind.Connect)]
    public static void OnConnect(ReducerContext ctx)
    {
        Log($"[OnConnect] New guest connected {ctx.Sender} at {ctx.Address}!");
    }

    [SpacetimeDB.Reducer(ReducerKind.Disconnect)]
    public static void OnDisconnect(ReducerContext ctx)
    {
        Log($"[OnDisconnect] Guest {ctx.Sender} at {ctx.Address} has disconnected.");
    }
    
    [SpacetimeDB.Table(Public = true)]
    public partial struct DataTable
    {
        [SpacetimeDB.Column(ColumnAttrs.PrimaryKeyAuto)]
        public uint Id;

        public string RandomDataOne;
        public string RandomDataTwo;
    }
    
    [SpacetimeDB.Reducer]
    public static void AddData(ReducerContext ctx)
    {
        var newData = new DataTable
        {
            RandomDataOne = "RandomDataOne",
            RandomDataTwo = "RandomDataTwo"
        };
        
        newData.Insert();
    }
    
    [SpacetimeDB.Reducer]
    public static void UpdateRandomDataOne(ReducerContext ctx, uint id, string data)
    {
        var oldData = DataTable.FilterById(id).First();
        
        var updatedData = oldData;
        updatedData.RandomDataOne = data;
        
        DataTable.UpdateById(id, updatedData);
    }
    
    [SpacetimeDB.Reducer]
    public static void UpdateRandomDataTwo(ReducerContext ctx, uint id, string data)
    {
        var oldData = DataTable.FilterById(id).First();
        
        var updatedData = oldData;
        updatedData.RandomDataTwo = data;
        
        DataTable.UpdateById(id, updatedData);
    }
    
    [SpacetimeDB.Reducer]
    public static void DeleteAll(ReducerContext ctx, uint id)
    {
        DataTable.DeleteById(id);
    }
}
