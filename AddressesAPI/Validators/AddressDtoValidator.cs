using FluentValidation;
using AddressesAPI.DTOs;

namespace AddressesAPI.Validators
{
    public class AddressDtoValidator : AbstractValidator<AddressDto>
    {
        public AddressDtoValidator()
        {
            RuleFor(x => x.Region).NotEmpty().WithMessage("Region is required.").MaximumLength(100);
            RuleFor(x => x.City).NotEmpty().WithMessage("City is required.").MaximumLength(100);
            RuleFor(x => x.BranchNumber).NotEmpty().WithMessage("BranchNumber is required.").MaximumLength(20);
            RuleFor(x => x.FullAddress).NotEmpty().WithMessage("FullAddress is required.").MaximumLength(200);
            RuleFor(x => x.Phone).NotEmpty().WithMessage("Phone is required.").MaximumLength(20);
            RuleFor(x => x.WorkingHours).NotEmpty().WithMessage("WorkingHours is required.").MaximumLength(100);
        }
    }
}
