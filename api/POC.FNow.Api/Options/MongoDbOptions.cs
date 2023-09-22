namespace POC.FNow.Api.Options
{
    public class MongoDbOptions
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string PlacesCollectionName { get; set; } = null!;
    }
}