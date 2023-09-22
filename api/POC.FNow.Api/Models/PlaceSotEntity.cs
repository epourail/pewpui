using System.Text.Json.Serialization;

namespace POC.FNow.Api.Models
{
    public class PlaceSotEntity
    {
        [JsonPropertyName("id")]
        public string? Id { get; set; }
        [JsonPropertyName("name")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? Name { get; set; } = null!;
        [JsonPropertyName("date_created")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public DateTime? DateCreated { get; set; }
        [JsonPropertyName("date_updated")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public DateTime? DateUpdated { get; set; }
        [JsonPropertyName("coordinates")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public GeoCoordinates? Coordinates { get; set; } = null!;
    }
}