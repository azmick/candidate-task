using AddressesAPI.DTOs;
using AddressesAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace AddressesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressesController : ControllerBase
    {
        private readonly IAddressService _service;
        private readonly ILogger<AddressesController> _logger;

        public AddressesController(IAddressService service, ILogger<AddressesController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAddresses()
        {
            _logger.LogInformation("GetAddresses endpoint called.");
            try
            {
                var addresses = await _service.GetAllAddressesAsync();
                _logger.LogInformation("GetAddresses succeeded. {Count} addresses returned.", addresses.Count());
                return Ok(addresses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetAddresses failed.");
                return StatusCode(500, "Bir hata oluştu.");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAddress(int id)
        {
            _logger.LogInformation("GetAddress endpoint called with id: {Id}", id);
            try
            {
                var address = await _service.GetAddressByIdAsync(id);
                if (address == null)
                {
                    _logger.LogWarning("GetAddress: Address not found. Id: {Id}", id);
                    return NotFound();
                }
                _logger.LogInformation("GetAddress succeeded for id: {Id}", id);
                return Ok(address);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetAddress failed for id: {Id}", id);
                return StatusCode(500, "Bir hata oluştu.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAddress([FromBody] AddressDto addressDto)
        {
            _logger.LogInformation("CreateAddress endpoint called.");
            if (addressDto == null)
            {
                _logger.LogWarning("CreateAddress: Request body is null.");
                return BadRequest();
            }

            try
            {
                var created = await _service.CreateAddressAsync(addressDto);
                _logger.LogInformation("CreateAddress succeeded. New address created with id: {Id}", created.Id);
                return CreatedAtAction(nameof(GetAddress), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CreateAddress failed.");
                return StatusCode(500, "Bir hata oluştu.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAddress(int id, [FromBody] AddressDto addressDto)
        {
            _logger.LogInformation("UpdateAddress endpoint called for id: {Id}", id);
            if (addressDto == null)
            {
                _logger.LogWarning("UpdateAddress: Request body is null for id: {Id}", id);
                return BadRequest();
            }

            try
            {
                var updated = await _service.UpdateAddressAsync(id, addressDto);
                if (!updated)
                {
                    _logger.LogWarning("UpdateAddress: Address not found for id: {Id}", id);
                    return NotFound();
                }
                _logger.LogInformation("UpdateAddress succeeded for id: {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateAddress failed for id: {Id}", id);
                return StatusCode(500, "Bir hata oluştu.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            _logger.LogInformation("DeleteAddress endpoint called for id: {Id}", id);
            try
            {
                var deleted = await _service.DeleteAddressAsync(id);
                if (!deleted)
                {
                    _logger.LogWarning("DeleteAddress: Address not found for id: {Id}", id);
                    return NotFound();
                }
                _logger.LogInformation("DeleteAddress succeeded for id: {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteAddress failed for id: {Id}", id);
                return StatusCode(500, "Bir hata oluştu.");
            }
        }

        [HttpPost("bulk-import")]
        public async Task<IActionResult> BulkImport([FromBody] List<string> lines)
        {
            if (lines == null || lines.Count == 0)
                return BadRequest("Veri yok");
            try
            {
                await _service.BulkImportAsync(lines);
                return Ok("Adresler başarıyla eklendi.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "BulkImport failed.");
                return StatusCode(500, "Bir hata oluştu.");
            }

        }
    }
}
