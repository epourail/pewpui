namespace POC.FNow.Api.Models
{
    public class PlaceDto
    {
        public string? Id { get; set; }
        public string Name { get; set; } = null!;
        public GeoCoordinates? Coordinates { get; set; } = null!;
    }
}