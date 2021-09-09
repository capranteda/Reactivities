using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Persistance;
using MediatR;
using Application.Activities;
using Application.core;
using API.Extensions;
using FluentValidation.AspNetCore;
using API.Middleware;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using API.SignalR;

namespace API
{
    public class Startup
    {
        public readonly IConfiguration _config;
        public Startup(IConfiguration config)
        {
            _config = config;
            // Configuration = configuration;
        }

        //Todo 
        // public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));

            })
            .AddFluentValidation(config =>
            {
                config.RegisterValidatorsFromAssemblyContaining<Create>();
            });
            services.AddApplicationServices(_config);
            services.AddIdentityServices(_config);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            //LE agregamos un poco de seguridad
            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(opt => opt.NoReferrer());
            app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
            app.UseXfo(opt => opt.Deny());
            // app.UseCspReportOnly(opt => opt no detiene la aplicacion, pero lo reporta. UseCsp es para detener la aplicacion
            app.UseCsp(opt => opt
            .BlockAllMixedContent()
            //Decimos que confiamos y que permita los estilos de los sitios externos a parte de las propias
            .StyleSources(s => s.Self().CustomSources(
                "https://fonts.googleapis.com",
                "sha256-yChqzBduCCi4o4xdbXRXh4U/t1rP4UUUMJt+rB+ylUI=",
                "sha256-r3x6D0yBZdyG8FpooR5ZxcsLuwuJ+pSQ/80YzwXS5IU="))
            //Decimos que permita los fonts de los sitios externos a parte de los propios. Basicamente de las fuentes que empiezan con...
            .FontSources(s => s.Self().CustomSources(
                "https://fonts.gstatic.com", "data:"))
            .FormActions(s => s.Self())
            .FrameAncestors(s => s.Self())
            //Decimos que confiamos y que permita las imagenes de los sitios externos a parte de las propias
            .ImageSources(s => s.Self().CustomSources(
                "https://res.cloudinary.com",
                "https://www.facebook.com",
                "https://platform-lookaside.fbsbx.com"
            ))
            // Un inline-script es un script que se ejecuta en el contexto del documento es decir dentro del mismo html, que no es lo mismo que un script externo.
            .ScriptSources(s => s.Self().CustomSources(
                "sha256-pEGqpGbAe4AVDYhlaqozkC1MWLOi3h5+YdxwJLqZk/Q=",
                "https://connect.facebook.net",
                "sha256-bOrB+lAXR5KAgwXdVc+y0ITam8vTDE2NJT+qsq1jmHY="))
            );
            //terminamos la seguridad


            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                //HTTP Strict-Transport-Security (a menudo abreviado como HSTS (en-US)) es una característica de seguridad que permite a un sitio web indicar a los navegadores que sólo se debe comunicar con HTTPS en lugar de usar HTTP.
                app.Use(async (context, next) =>
                {
                    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
                    await next.Invoke();
                });
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            //UseDefaultFiles es para que cuando se haga una peticion a la raiz de la aplicacion (wwwroot), se muestre el index.html
            app.UseDefaultFiles();
            //Esta configuracion es para poder utilizar static files, o sea react
            app.UseStaticFiles();


            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat");
                //MapFallbackToController sirve para cuando no se encuentra una ruta, se muestre el index del controller que se le pasa. En este caso, el index del controller FallbackController
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
