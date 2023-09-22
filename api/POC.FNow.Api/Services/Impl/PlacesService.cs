using POC.FNow.Api.Models;
using POC.FNow.Api.Repository.Interfaces;
using POC.FNow.Api.Services.Interfaces;

namespace POC.FNow.Api.Services.Impl
{
    public class PlacesService : IReadPlacesService, IWritePlacesService
    {
        private readonly ICachePlacesRepository _cachePlacesRepository;
        private readonly ISotPlacesRepository _sotPlacesRepository;

        public PlacesService(
            ICachePlacesRepository cachePlacesRepository, 
            ISotPlacesRepository sotPlacesRepository)
        {
            _cachePlacesRepository = cachePlacesRepository;
            _sotPlacesRepository = sotPlacesRepository;
        }

        public Task<string> CreatePlace(Place place)
        {
            return _sotPlacesRepository.CreateAsync(place);
        }

        public async Task PatchPlace(Place place)
        {
            await _sotPlacesRepository.PatchAsync(place);
        }

        public Task<IEnumerable<Place>> GetPlacesAsync(GeoCoordinates coordinates, int radius, int page = 1, int size = 50)
        {
            return _cachePlacesRepository.GetByRadius(coordinates, radius, page, size);
        }
    }
}
