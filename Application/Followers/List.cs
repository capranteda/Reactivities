using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            //Predicado para saber si queremos devolver una lista de followers o de followings
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        //Como automaper tiene una clase con una propiedad Profile, tenemos que que aclarar que la que vamos a usar viene de la clase Profiles.Profile
        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<Profiles.Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        // los seguidores van a ser los perfiles que en la tabla UserFollowings tengan como target.username el username que nos pasan
                        profiles = await _context.UserFollowings.Where(x => x.Target.UserName == request.Username)
                        //Usamos el projection para aclarar que solo  queremos el observer (el target ya lo tenemos)
                        .Select(u => u.Observer)
                        //usamos el projectTo para convertir el AppUser en un Profile
                        .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider,
                        new { currentUsername = _userAccessor.GetUsername() })
                        .ToListAsync(cancellationToken);
                        break;

                    case "following":
                        // los seguidores van a ser los perfiles que en la tabla UserFollowings tengan como observer.username el username que nos pasan
                        profiles = await _context.UserFollowings.Where(x => x.Observer.UserName == request.Username)
                        //Solo seleccionamos el target
                        .Select(u => u.Target)
                        //usamos el projectTo para convertir el AppUser en un Profile
                        .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider,
                        new { currentUsername = _userAccessor.GetUsername() })
                        .ToListAsync(cancellationToken);
                        break;
                }
                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}