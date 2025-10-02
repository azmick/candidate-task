using AddressesAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AddressesAPI.Repositories
{
    public interface IAddressRepository
    {
        Task<IEnumerable<Address>> GetAllAsync();
        Task<Address?> GetByIdAsync(int id);
        Task AddAsync(Address address);
        Task UpdateAsync(Address address);
        Task DeleteAsync(int id);
        Task<bool> SaveChangesAsync();
        Task DeleteAsync(Address existing);
    }
}
