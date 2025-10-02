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
        await _repository.UpdateAsync(existing);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAddressAsync(int id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null) return false;

        await _repository.DeleteAsync(existing);
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
}
