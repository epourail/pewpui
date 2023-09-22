using POC.FNow.Api.Models;

namespace POC.FNow.Api.Services.Interfaces
{
    public interface IWritePlacesService
    {
        Task<string> CreatePlace(Place place);
        Task PatchPlace(Place place);
    }
}
