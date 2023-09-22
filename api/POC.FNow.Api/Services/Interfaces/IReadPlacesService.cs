using POC.FNow.Api.Models;

namespace POC.FNow.Api.Services.Interfaces
{
    public interface IReadPlacesService
    {
        Task<IEnumerable<Place>> GetPlacesAsync(GeoCoordinates coordinates, int radius, int page = 1, int size = 50);
    }
}
