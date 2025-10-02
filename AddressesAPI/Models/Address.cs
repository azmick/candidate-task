namespace AddressesAPI.Models;

public class Address
{
    public int Id { get; set; }
    public string Region { get; set; } = null!;
    public string City { get; set; } = null!;
    public string BranchNumber { get; set; } = null!;   // örn: "№16"
    public string FullAddress { get; set; } = null!;    // örn: "просп. Леніна, 84"
    public string Phone { get; set; } = null!;          // örn: "+380974805040"
    public string WorkingHours { get; set; } = null!;   // örn: "пн-ср 08:00-15:00, сб-нд 10:00-12:00"
}
