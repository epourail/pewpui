using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using MongoDB.Driver.GeoJsonObjectModel;
using MongoDB.Bson.Serialization;

namespace POC.FNow.Api.Models
{
    public class PlaceCacheEntity
    {
        [BsonId]
        public string? Id { get; set; }
        [BsonElement("name")]
        [BsonIgnoreIfNull(true)]
        public string Name { get; set; } = null!;
        [BsonElement("coordinates")]
        [BsonIgnoreIfNull(true)]
        public GeoPoint? Coordinates { get; set; } = null!;
    }

    public class GeoPoint
    {
        [BsonElement("type")]
        public string Type { get; set; } = "Point";
        [BsonElement("coordinates")]
        public double[] Coordinates { get; set; } = null!;
    }
}
