using System.Text.Json.Serialization;

namespace POC.FNow.Api.Models
{
    public class PlaceDeleteEvent
    {
        [JsonPropertyName("event-data")]
        public PlaceDeleteEventData Data { get; set; }
    }

    public class PlaceDeleteEventData
    {
        [JsonPropertyName("event")]
        public string Event { get; set; }

        [JsonPropertyName("keys")]
        public string[] Keys { get; set; }
    }
}
