using System.Text.Json.Serialization;

namespace POC.FNow.Api.Models
{
    public class GeoCoordinates
    {
        [JsonPropertyName("type")]
        public string Type { get; set; } = "Point";
        [JsonPropertyName("coordinates")]
        public double[] Coordinates { get; set; } = null!;
    }
}