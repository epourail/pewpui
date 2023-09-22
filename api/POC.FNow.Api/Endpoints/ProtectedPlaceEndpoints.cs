using Microsoft.AspNetCore.Http.HttpResults;
using POC.FNow.Api.Services.Interfaces;
using POC.FNow.Api.Models;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;

namespace POC.FNow.Api.Endpoints
{
    public static class ProtectedPlaceEndpoints
    {
        public static RouteGroupBuilder MapProtectedPlaceApi(this RouteGroupBuilder group)
        {
            group.MapPost("/", (PlaceDto placeDto, IWritePlacesService writePlaceService, IMapper mapper) => CreatePlace(placeDto, writePlaceService, mapper));
            group.MapPatch("/{id}", (PlaceDto placeDto, [FromRoute] string id, IWritePlacesService writePlaceService, IMapper mapper) => PatchPlace(placeDto, id, writePlaceService, mapper));

            return group;
        }

        public static async Task<Created<PlaceDto>> CreatePlace(PlaceDto placeDto, IWritePlacesService writePoiService, IMapper mapper)
        {
            if (placeDto == null)
                throw new BadHttpRequestException("place is invalid");

            var placeId = await writePoiService.CreatePlace(mapper.Map<Place>(placeDto));

            return TypedResults.Created<PlaceDto>($"{placeId}", null);
        }

        public static async Task<NoContent> PatchPlace(PlaceDto placeDto, string id, IWritePlacesService writePoiService, IMapper mapper)
        {
            if (placeDto == null)
                throw new BadHttpRequestException("place is invalid");

            if (string.IsNullOrWhiteSpace(id))
                throw new BadHttpRequestException("place id is invalid");

            var place = mapper.Map<Place>(placeDto);
            place.Id = id;

            await writePoiService.PatchPlace(place);

            return TypedResults.NoContent();
        }
    }
}