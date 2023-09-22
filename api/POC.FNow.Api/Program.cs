using POC.FNow.Api.Endpoints;
using POC.FNow.Api.Options;
using POC.FNow.Api.Repository.Impl;
using POC.FNow.Api.Repository.Interfaces;
using POC.FNow.Api.Services.Impl;
using POC.FNow.Api.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication().AddJwtBearer(config =>
{
    config.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateAudience = false,
        ValidateIssuerSigningKey = false,
        ValidateIssuer = false,
        RequireSignedTokens = false,
        SignatureValidator = delegate (string token, TokenValidationParameters parameters)
        {
            return new JwtSecurityToken(token);
        }
    };
});

builder.Services.AddAuthorizationBuilder()
  .AddPolicy("admin_policy", policy =>
        policy
            .RequireRole("Admin"));

builder.Services.Configure<DirectusOptions>(builder.Configuration.GetSection(nameof(DirectusOptions)));
builder.Services.Configure<MongoDbOptions>(builder.Configuration.GetSection(nameof(MongoDbOptions)));

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddScoped<IReadPlacesService, PlacesService>();
builder.Services.AddScoped<IWritePlacesService, PlacesService>();
builder.Services.AddScoped<ISotPlacesRepository, SotPlacesRepository>();
builder.Services.AddScoped<ICachePlacesRepository, MongoPlacesRepository>();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGroup("/public/places")
    .MapPublicPlaceApi()
    .WithTags("Public", "Places")
    .WithOpenApi();

app.MapGroup("/protected/places")
    .MapProtectedPlaceApi()
    .WithTags("Protected", "Places")
.WithOpenApi()
    .RequireAuthorization("admin_policy");

app.MapGroup("/webhook/places")
    .MapWebhookApi()
    .WithTags("Protected", "webhook")
    .WithOpenApi();

app.Run();