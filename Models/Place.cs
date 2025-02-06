namespace MapApp.Models{
public class Place
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; // Standardverdi = tom streng
    public string Description { get; set; } = string.Empty; // Standardverdi = tom streng
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? ImageUrl { get; set; }
}
}