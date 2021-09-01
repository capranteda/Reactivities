using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Application.core
{
    //Hacemos que herede de List<T> , queremos paginar lo que sea
    public class PagedList<T> : List<T>
    {
        public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
        {
            CurrentPage = pageNumber;
            // Por ejemplo si la lista tiene 12 items y el pageSize es 10, TotalPages será 2
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }


        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        //Los metodos estaticos son metodos que no necesitan un objeto/instancia
        //El source va a ser la totalidad de la lista de objetos para tener una idea de la cantidad primero
        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            //Antes de paginar, necesitamos saber cuantos elementos hay en la lista
            var count = await source.CountAsync();
            // Skip y take son operaciones que nos permiten saltar items y obtener items
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            // Con esta informacion vamos a llenar el PagedList
            return new PagedList<T>(items, count, pageNumber, pageSize);

        }
    }
}