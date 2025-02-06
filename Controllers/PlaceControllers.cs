using Microsoft.AspNetCore.Mvc;       // MVC og API-kontroller
using Microsoft.EntityFrameworkCore;  // For databaseoperasjoner
using MapApp.Data;                    // For tilgang til AppDbContext
using MapApp.Models;                  // For tilgang til Place-modellen

namespace MapApp.Controllers
{
    [Route("api/places")]
    [ApiController]
    public class PlaceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlaceController(AppDbContext context)
        {
            _context = context;
        }

        // Hent alle steder
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Place>>> GetPlaces()
        {
            return await _context.Places.ToListAsync();
        }

        // Legg til et nytt sted
        [HttpPost]
        public async Task<ActionResult<Place>> PostPlace(Place place)
        {
            _context.Places.Add(place);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPlaces), new { id = place.Id }, place);
        }

        // Slett et sted
       [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlace(int id)
{
    var place = await _context.Places.FindAsync(id);
    if (place == null)
    {
        return NotFound();
    }

    _context.Places.Remove(place);
    await _context.SaveChangesAsync();

    return NoContent();
}

    }
}
