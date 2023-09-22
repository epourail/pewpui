using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using POC.FNow.Api.Models;
using POC.FNow.Api.Services.Interfaces;

namespace POC.FNow.Api.Endpoints
{
    public static class PublicPlaceEndpoints
    {
        public static RouteGroupBuilder MapPublicPlaceApi(this RouteGroupBuilder group)
        {
            group.MapGet("/", ([FromQuery] double latitude, [FromQuery] double longitude, [FromQuery] int radius, IReadPlacesService readPlaceService, IMapper mapper) 
                => GetPlaces(latitude, longitude, radius, readPlaceService, mapper));
            return group;
        }

        public static async Task<IEnumerable<PlaceDto>> GetPlaces(double latitude, [FromQuery] double longitude, [FromQuery] int radius, IReadPlacesService readPlaceService, IMapper mapper)
        {
            var places = await readPlaceService.GetPlacesAsync(new GeoCoordinates
            {
                Coordinates = new double[]{latitude, longitude}
            },
            radius,
            1, // first page
            50 // number of elements per page
            );
            return mapper.Map<IEnumerable<PlaceDto>>(places);
        }
    }
}
