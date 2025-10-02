using AutoMapper;
using AddressesAPI.Models;
using AddressesAPI.DTOs;

namespace AddressesAPI.Mapping
{
    public class AddressProfile : Profile
    {
        public AddressProfile()
        {
            CreateMap<Address, AddressDto>().ReverseMap();
        }
    }
}
