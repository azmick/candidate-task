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
        void UpdateAsync(Address address);
        void DeleteAsync(Address adress);
        Task<bool> SaveChangesAsync();
    }
}
