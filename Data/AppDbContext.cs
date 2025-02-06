using Microsoft.EntityFrameworkCore;
using MapApp.Models; // Husk å importere dine modeller

namespace MapApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Place> Places { get; set; }
    }
}
