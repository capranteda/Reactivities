using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //Lo hacemos anonimo para que pueda entrar sin autenticacion
    [AllowAnonymous]
    //Hacemos que herede de la clase Controller porque queremos usar un Action
    public class FallbackController : Controller
    {
        public IActionResult Index()
        {
            //De esta manera le decimos que nos devuelva un archivo index.html que esta en la carpeta wwwroot
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
            "wwwroot", "index.html"), "text/HTML");
        }

    }
}