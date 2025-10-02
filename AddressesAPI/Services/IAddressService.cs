using AddressesAPI.DTOs;
using AddressesAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AddressesAPI.Services
{
    public interface IAddressService
    {
        Task<IEnumerable<AddressDto>> GetAllAddressesAsync();
        Task<Address?> GetAddressByIdAsync(int id);
        Task<Address> CreateAddressAsync(AddressDto addressDto);
        Task<bool> UpdateAddressAsync(int id, AddressDto addressDto);
        Task<bool> DeleteAddressAsync(int id);
        Task BulkImportAsync(IEnumerable<string> lines);
    }
}
