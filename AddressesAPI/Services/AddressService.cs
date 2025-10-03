using AddressesAPI.DTOs;
using AddressesAPI.Models;
using AddressesAPI.Repositories;
using AddressesAPI.Services;
using AutoMapper;

public class AddressService : IAddressService
{
    private readonly IAddressRepository _repository;
    private readonly IMapper _mapper;

    public AddressService(IAddressRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<AddressDto>> GetAllAddressesAsync()
    {
        var addresses = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<AddressDto>>(addresses);
    }

    public async Task<AddressDto?> GetAddressByIdAsync(int id)
    {
        var address = await _repository.GetByIdAsync(id);
        return address == null ? null : _mapper.Map<AddressDto>(address);
    }

    public async Task<AddressDto> CreateAddressAsync(AddressDto addressDto)
    {
        var address = _mapper.Map<Address>(addressDto);
        await _repository.AddAsync(address);
        await _repository.SaveChangesAsync();
        return _mapper.Map<AddressDto>(address);
    }

    public async Task<bool> UpdateAddressAsync(int id, AddressDto addressDto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return false;

        _mapper.Map(addressDto, existing);
        _repository.UpdateAsync(existing);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAddressAsync(int id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return false;

        _repository.DeleteAsync(existing);
        await _repository.SaveChangesAsync();
        return true;
    }

    Task<Address?> IAddressService.GetAddressByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    Task<Address> IAddressService.CreateAddressAsync(AddressDto addressDto)
    {
        throw new NotImplementedException();
    }

    public async Task BulkImportAsync(IEnumerable<string> lines)
    {
        foreach (var line in lines)
        {
            var address = ParseAddress(line);
            await _repository.AddAsync(address);
        }
        await _repository.SaveChangesAsync();
    }
    private Address ParseAddress(string input)
    {
        // Örnek: "Запорізька обл., Запоріжжя, Відділення №16 (до 30 кг на одне місце): просп. Леніна, 84, +380974805040, пн-ср 08:00-15:00, сб-нд 10:00-12:00"
        // veya:  "Київська обл., Київ, Поштомат InPost 24/7, №2029: пр-т Повітрофлотський, 56а (цілодобовий поштомат біля маг.\"Billa\"), +380974803040, пн-ср 08:00-15:00, сб-нд 10:00-20:00"

        // 1. Bölge ve şehir
        var firstSplit = input.Split(',', 3);
        if (firstSplit.Length < 3)
            throw new FormatException("Geçersiz format: Bölge, şehir ve devamı ayrıştırılamadı.");

        var region = firstSplit[0].Trim();
        var city = firstSplit[1].Trim();
        var rest = firstSplit[2].Trim();

        // 2. Şube/poshmat ve adres/diğer bilgiler
        var colonSplit = rest.Split(':', 2);
        if (colonSplit.Length < 2)
            throw new FormatException("Geçersiz format: ':' bulunamadı.");

        var branchAndMaybeNumber = colonSplit[0].Trim();
        var right = colonSplit[1].Split(',').Select(x => x.Trim()).ToList();

        // Şube numarası (№) varsa al
        string branchNumber = "";
        var branchNumberMatch = System.Text.RegularExpressions.Regex.Match(branchAndMaybeNumber, @"№\d+");
        if (branchNumberMatch.Success)
            branchNumber = branchNumberMatch.Value;

        // FullAddress: ilk virgülden sonraki kısım (adres)
        var fullAddress = right.Count > 0 ? right[0] : "";

        // Telefon: genellikle + ile başlar, yoksa boş bırak
        var phone = right.FirstOrDefault(x => x.StartsWith("+")) ?? "";

        // Çalışma saatleri: telefon ve adres dışındaki kalanlar
        var workingHours = string.Join(", ", right.Where(x => x != fullAddress && x != phone));

        return new Address
        {
            Region = region,
            City = city,
            BranchNumber = branchNumber,
            FullAddress = fullAddress,
            Phone = phone,
            WorkingHours = workingHours
        };
    }

}
