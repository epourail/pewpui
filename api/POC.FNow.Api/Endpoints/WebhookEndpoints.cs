using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using POC.FNow.Api.Models;
using POC.FNow.Api.Repository.Interfaces;

namespace POC.FNow.Api.Endpoints
{
    public static class WebhookEndpoints
    {
        public static RouteGroupBuilder MapWebhookApi(this RouteGroupBuilder group)
        {
            group.MapPost("/create", ([FromBody] PlaceCreateEvent createEvent, ICachePlacesRepository cachePlacesService, IMapper mapper) => WebhookCreateEventAsync(createEvent, cachePlacesService, mapper));
            group.MapPost("/update", ([FromBody] PlaceUpdateEvent updateEvent, ICachePlacesRepository cachePlacesService, IMapper mapper) => WebhookUpdateEventAsync(updateEvent, cachePlacesService, mapper));
            group.MapPost("/delete", ([FromBody] PlaceDeleteEvent deleteEvent, ICachePlacesRepository cachePlacesService) => WebhookDeleteEventAsync(deleteEvent, cachePlacesService));

            return group;
        }

        public static async Task WebhookCreateEventAsync(PlaceCreateEvent createEvent, ICachePlacesRepository cachePlacesService, IMapper mapper)
        {
            var place = mapper.Map<Place>(createEvent.Data);
            await cachePlacesService.CreateAsync(place);
        }

        public static async Task WebhookUpdateEventAsync(PlaceUpdateEvent updateEvent, ICachePlacesRepository cachePlacesService, IMapper mapper)
        {
            var place = mapper.Map<Place>(updateEvent.Data);
            await cachePlacesService.PatchAsync(place);
        }

        public static async Task WebhookDeleteEventAsync(PlaceDeleteEvent deleteEvent, ICachePlacesRepository cachePoisService)
        {
            await cachePoisService.DeleteAsync(deleteEvent.Data.Keys);
        }
    }
}
