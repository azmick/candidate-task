using Microsoft.EntityFrameworkCore;
using AddressesAPI.Models;

namespace AddressesAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Address> Addresses { get; set; } = null!;
    }
}
