using AutoMapper;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using POC.FNow.Api.Models;
using POC.FNow.Api.Options;
using POC.FNow.Api.Repository.Interfaces;

namespace POC.FNow.Api.Repository.Impl
{
    public class MongoPlacesRepository : ICachePlacesRepository
    {
        private readonly IMongoCollection<PlaceCacheEntity> _placesCollection;
        private readonly IMapper _mapper;

        public MongoPlacesRepository(IMapper mapper, IOptions<MongoDbOptions> options)
        {
            var opts = options?.Value ?? throw new ArgumentNullException(nameof(options));
            var mongoClient = new MongoClient(opts.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(opts.DatabaseName);

            // Get places collection
            _placesCollection = mongoDatabase.GetCollection<PlaceCacheEntity>(opts.PlacesCollectionName);

            // Add geospatial index
            IndexKeysDefinition<PlaceCacheEntity> keys = "{ coordinates: \"2dsphere\" }";
            var indexModel = new CreateIndexModel<PlaceCacheEntity>(keys);
            _placesCollection.Indexes.CreateOne(indexModel);

            _mapper = mapper;
        }

        public async Task<string> CreateAsync(Place place)
        {
            var placeCache = _mapper.Map<PlaceCacheEntity>(place);
            await _placesCollection.InsertOneAsync(placeCache);

            return place.Id;
        }

        public async Task PatchAsync(Place place)
        {
            var placeCache = _mapper.Map<PlaceCacheEntity>(place);
            var filter = Builders<PlaceCacheEntity>.Filter
                .Eq(x => x.Id, placeCache.Id);
            var update = Builders<PlaceCacheEntity>.Update;

            IList<UpdateDefinition<PlaceCacheEntity>>  updateDefinitions = new List<UpdateDefinition<PlaceCacheEntity>>();

            // Really shitty
            if (placeCache.Name != null)
            {
                updateDefinitions.Add(update.Set(x => x.Name, placeCache.Name));
            }

            if (placeCache.Coordinates != null)
            {
                updateDefinitions.Add(update.Set(x => x.Coordinates, placeCache.Coordinates));
            }

            await _placesCollection.UpdateOneAsync(filter, update.Combine(updateDefinitions));
        }
        
        public Task DeleteAsync(IEnumerable<string> ids) => _placesCollection.DeleteManyAsync(x => ids.Contains(x.Id));

        public async Task<IEnumerable<Place>> GetByRadius(GeoCoordinates coordinates, int radius, int page = 1, int offset = 50)
        {
            var builder = Builders<PlaceCacheEntity>.Filter;

            var point = GeoJson.Point(GeoJson.Position(coordinates.Coordinates[0], coordinates.Coordinates[1]));

            // distance in meters
            var filter = builder.Near(x => x.Coordinates, point, maxDistance: radius, minDistance: 0);

            var dbPlaces = await _placesCollection.Find(filter: filter).Skip((page - 1) * offset).Limit(offset).ToListAsync();
            return _mapper.Map<IEnumerable<Place>>(dbPlaces.ToList());
        }

        public Task<IEnumerable<Place>> GetByShape(GeoCoordinates[] coordinates, int page = 1, int offset = 50)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Place>> GetByName(string name)
        {
            throw new NotImplementedException();
        }

        public Task<Place> GetById(string id)
        {
            throw new NotImplementedException();
        }
    }
}
