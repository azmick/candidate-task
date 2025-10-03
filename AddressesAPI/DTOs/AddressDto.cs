namespace AddressesAPI.DTOs;

public class AddressDto
{
    public int Id { get; set; }
    public string Region { get; set; } = null!;
    public string City { get; set; } = null!;
    public string BranchNumber { get; set; } = null!;
    public string FullAddress { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string WorkingHours { get; set; } = null!;
}
