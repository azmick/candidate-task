using AddressesAPI.Data;
using AddressesAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AddressesAPI.Repositories
{
    public class AddressRepository : IAddressRepository
    {
        private readonly AppDbContext _context;

        public AddressRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Address>> GetAllAsync()
        {
            return await _context.Addresses.ToListAsync();
        }

        public async Task<Address?> GetByIdAsync(int id)
        {
            return await _context.Addresses.FindAsync(id);
        }

        public async Task AddAsync(Address address)
        {
            await _context.Addresses.AddAsync(address);
        }

        public async Task UpdateAsync(Address address)
        {
            _context.Addresses.Update(address);
        }

        public async Task DeleteAsync(Address address)
        {
            _context.Addresses.Remove(address);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        Task<bool> IAddressRepository.SaveChangesAsync()
        {
            throw new NotImplementedException();
        }
    }
}
