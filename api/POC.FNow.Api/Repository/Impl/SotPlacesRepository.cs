using Microsoft.Extensions.Options;
using POC.FNow.Api.Models;
using POC.FNow.Api.Options;
using POC.FNow.Api.Repository.Interfaces;
using Flurl.Http;
using Flurl;
using AutoMapper;
using System.Text.Json;

namespace POC.FNow.Api.Repository.Impl
{
    public class SotPlacesRepository : ISotPlacesRepository
    {
        private readonly IOptions<DirectusOptions> _options;
        private readonly IMapper _mapper;

        public SotPlacesRepository(IOptions<DirectusOptions> options, IMapper mapper)
        {
            _options = options;
            _mapper = mapper;
        }

        public async Task<string> CreateAsync(Place place)
        {
            var placeId = Guid.NewGuid().ToString();

            var placeSot = _mapper.Map<PlaceSotEntity>(place);
            placeSot.Id = placeId;
            var utcNow = DateTime.UtcNow;
            placeSot.DateCreated = utcNow;
            placeSot.DateUpdated = utcNow;

            await _options.Value.Url
                .AppendPathSegment("items")
                .AppendPathSegment("places")
                .WithHeader("Content-Type", "application/json")
                .WithHeaders(_options.Value.ExtraHeaders)
                .WithOAuthBearerToken(_options.Value.PermToken)
                .SendAsync(HttpMethod.Post, new StringContent(JsonSerializer.Serialize(placeSot)));

            return placeId;
        }

        public async Task PatchAsync(Place place)
        {
            var placeSot = _mapper.Map<PlaceSotEntity>(place);
            placeSot.DateUpdated = DateTime.UtcNow;

            await _options.Value.Url
                .AppendPathSegment("items")
                .AppendPathSegment("places")
                .AppendPathSegment(place.Id)
                .WithHeader("Content-Type", "application/json") // mandatory
                .WithHeaders(_options.Value.ExtraHeaders)
                .WithOAuthBearerToken(_options.Value.PermToken)
                .SendAsync(HttpMethod.Patch, new StringContent(JsonSerializer.Serialize(placeSot)));
        }

        public async Task DeleteAsync(IEnumerable<string> ids)
        {
            foreach(var id in ids)
            {
                await _options.Value.Url
                    .AppendPathSegment("items")
                    .AppendPathSegment("places")
                    .AppendPathSegment(id)
                    .WithOAuthBearerToken(_options.Value.PermToken)
                    .WithHeaders(_options.Value.ExtraHeaders)
                    .DeleteAsync();
            }
        }

        public Task<Place> GetById(string id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Place>> GetByName(string name)
        {
            throw new NotImplementedException();
        }
    }
}
