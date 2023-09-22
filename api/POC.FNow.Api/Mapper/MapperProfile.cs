using AutoMapper;
using POC.FNow.Api.Models;

namespace POC.FNow.Api.Mapper
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            CreateMap<PlaceCreateEventData, Place>(MemberList.None)
                .ForMember(d => d.Id, opts => opts.MapFrom(x => x.Key))
                .ForMember(d => d.Name, opts => opts.MapFrom(x => x.Payload.Name))
                .ForMember(d => d.Coordinates, opts => opts.MapFrom(x => x.Payload.Coordinates));

            CreateMap<PlaceUpdateEventData, Place>(MemberList.None)
                .ForMember(d => d.Id, opts => opts.MapFrom(x => x.Keys.FirstOrDefault())) // We don't handle the multi update
                .ForMember(d => d.Name, opts => opts.MapFrom(x => x.Payload.Name))
                .ForMember(d => d.Coordinates, opts => opts.MapFrom(x => x.Payload.Coordinates));

            CreateMap<PlaceDto, Place>(MemberList.None)
                .ForMember(d => d.Id, opts => opts.MapFrom(x => x.Id))
                .ForMember(d => d.Name, opts => opts.MapFrom(x => x.Name))
                .ForMember(d => d.Coordinates, opts => opts.MapFrom(x => x.Coordinates))
                .ReverseMap();

            CreateMap<Place, PlaceCacheEntity>(MemberList.None)
                .ForMember(d => d.Id, opts => opts.MapFrom(x => x.Id))
                .ForMember(d => d.Name, opts => opts.MapFrom(x => x.Name))
                .ForMember(d => d.Coordinates, opts => opts.MapFrom(x => x.Coordinates))
                .ReverseMap();

            CreateMap<GeoCoordinates, GeoPoint>(MemberList.None)
                .ForMember(d => d.Coordinates, opts => opts.MapFrom(x => x.Coordinates))
                .ReverseMap();

            CreateMap<Place, PlaceSotEntity>(MemberList.None)
                .ForMember(d => d.Id, opts => opts.MapFrom(x => x.Id))
                .ForMember(d => d.Name, opts => opts.MapFrom(x => x.Name))
                .ForMember(d => d.Coordinates, opts => opts.MapFrom(x => x.Coordinates));
        }
    }
}
