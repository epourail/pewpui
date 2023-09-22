#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["POC.FNow.Api/POC.FNow.Api.csproj", "POC.FNow.Api/"]
RUN dotnet restore "POC.FNow.Api/POC.FNow.Api.csproj"
COPY . .
WORKDIR "/src/POC.FNow.Api"
RUN dotnet build "POC.FNow.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "POC.FNow.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "POC.FNow.Api.dll"]