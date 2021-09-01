using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        //Creamos esta clase para mandarle un response con los datos de la paginacion al cliente extendiendo la clase HttpResponse
        public static void AddPaginationHeader(this HttpResponse response, int currentPage,
        int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };
            //Aqui se esta mandando el response con los datos de la paginacion serializandolo en json
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader));
            //Para que se pueda agregar y lo puedan ver desde el client hay que exponerlo como un header
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");

        }
    }
}

