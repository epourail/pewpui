using POC.FNow.Api.Models;

namespace POC.FNow.Api.Repository.Interfaces
{
    public interface ICachePlacesRepository: IPlacesRepository
    {
        Task<IEnumerable<Place>> GetByRadius(GeoCoordinates coordinates, int radius, int page = 1, int offset = 50);
        Task<IEnumerable<Place>> GetByShape(GeoCoordinates[] coordinates, int page = 1, int offset = 50);
    }
}