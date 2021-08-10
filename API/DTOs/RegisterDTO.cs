using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDTO
    {
        [Required]
        public string DisplayName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Password must contain at least 4 characters, at least 1 uppercase letter, at least 1 lowercase letter and at least 1 number")]
        public string Password { get; set; }
        [Required]
        public string UserName { get; set; }
    }
}