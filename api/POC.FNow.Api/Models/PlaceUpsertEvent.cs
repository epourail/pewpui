using System.Text.Json.Serialization;

namespace POC.FNow.Api.Models
{
    public class PlaceCreateEvent
    {
        [JsonPropertyName("event-data")]
        public PlaceCreateEventData Data { get; set; }
    }

    public class PlaceUpdateEvent
    {
        [JsonPropertyName("event-data")]
        public PlaceUpdateEventData Data { get; set; }
    }

    public class PlaceEventData
    {
        [JsonPropertyName("event")]
        public string Event { get; set; }

        [JsonPropertyName("payload")]
        public PlaceUpsertEventPayload Payload { get; set; }
    }

    public class PlaceUpdateEventData : PlaceEventData
    {
        [JsonPropertyName("keys")]
        public string[] Keys { get; set; }
    }

    public class PlaceCreateEventData : PlaceEventData
    {
        [JsonPropertyName("key")]
        public string Key { get; set; }
    }

    public class PlaceUpsertEventPayload
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = null!;

        [JsonPropertyName("coordinates")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public GeoCoordinates? Coordinates { get; set; } = null!;
    }
}
