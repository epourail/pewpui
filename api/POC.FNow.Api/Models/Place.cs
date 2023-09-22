namespace POC.FNow.Api.Models
{
    public class Place
    {
        public virtual string? Id { get; set; }

        public virtual string Name { get; set; } = null!;

        public GeoCoordinates? Coordinates { get; set; } = null!;
    }
}
