using System.Threading;
using System.Threading.Tasks;
using Application.core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Followers
{
    public class FollowToggle
    {
        //Usamos la clase command cuando no necesitamos devolver ningun dato

        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            //Vamos a usar DataContext para modificarla y IUserAccessor para acceder a la información de usuario (y obtener el observerId)
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //Obtenemos el usuario logueado para el observer
                var observer = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                // el target es el usuario que queremos seguir o dejar de seguir
                var target = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);

                //Si el usuario que queremos seguir no existe, devolvemos un error
                if (target == null) return null;

                // Intentamos obtener el vinculo de seguimiento
                var following = await _context.UserFollowings.FindAsync(observer.Id, target.Id);

                // Si no lo seguimos creamos el userFollowing
                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };
                    _context.UserFollowings.Add(following);
                }
                else
                {
                    // Si lo seguimos, lo eliminamos
                    _context.UserFollowings.Remove(following);
                }
                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}