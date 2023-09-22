using POC.FNow.Api.Models;

namespace POC.FNow.Api.Repository.Interfaces
{
    public interface IPlacesRepository
    {
        Task<Place> GetById(string id);
        Task<IEnumerable<Place>> GetByName(string name);
        Task<string> CreateAsync(Place place);
        Task PatchAsync(Place place);
        Task DeleteAsync(IEnumerable<string> ids);
    }
}
