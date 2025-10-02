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
        // "Запорізька обл., Запоріжжя, Відділення №16 (до 30 кг на одне місце): просп. Леніна, 84, +380974805040, пн-ср 08:00-15:00, сб-нд 10:00-12:00"
        var parts = input.Split(':', 2);
        if (parts.Length < 2) throw new FormatException("Geçersiz format");

        var left = parts[0].Split(',');
        var right = parts[1].Split(',');

        var region = left[0].Trim();
        var city = left[1].Trim();
        var branchInfo = left[2].Trim();
        var branchNumber = branchInfo.Contains("№")
            ? branchInfo.Substring(branchInfo.IndexOf('№')).Split(' ')[0]
            : "";

        var fullAddress = right[0].Trim();
        var phone = right[1].Trim();
        var workingHours = string.Join(", ", right.Skip(2).Select(x => x.Trim()));

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
