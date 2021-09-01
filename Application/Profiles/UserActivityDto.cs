using System;
using System.Text.Json.Serialization;

namespace Application.Profiles
{
    public class UserActivityDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }

        //Si en un dto queremos crear una propiedad que no se devuelva al usuario podemos usar el decorador JsonIgnore
        [JsonIgnore]
        public string HostUsername { get; set; }
    }
}