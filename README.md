# Node REST APIs

https://api-node-ipianetti.herokuapp.com/doc

---

### Tools

- JWT
- Swagger OpenAPI Generator
- TypeScript
- MongoDB with TypeORM
- Docker
- BitBucket Pipelines with Heroku

### Setup

Usar versión correcta de Node para el proyecto según `.nvmrc`

```
nvm use
```

```
npm install
```

Crear variables de entorno para conexión con MongoDB

```
# Environment: Copiar .envrc.dist y editar .envrc
cp .envrc.dist .envrc
# Aplicar cambios en .envrc
direnv allow
```

Ejecutar aplicación y sincronizar base de datos

```
npm run start
```

Ejecutar migración para crear usuarios iniciales

```
npm run migration:run
```

## Development

Ejecutar luego de editar controladores y entidades

```
# Creará las rutas de api y su swagger.json,
# según la configuración tsoa.json
npm run tsoa:gen
```

## Servidor local

```
# Crear Build
npm run build
# Migrar Base de Datos
npm run migration:run
# Correr aplicación
npm run prod
```

## Servidor local con Docker

```
# Crear Build
npm run build
# Migrar Base de Datos
npm run migration:run
# Crear y levantar contenedor
docker-compose -f docker/docker-compose.yml up -d --build
# Apagar contenedor
docker-compose -f docker/docker-compose.yml stop
```

## Deploy en Heroku con BitBucket Pipeline

Configurado según script `build`, `start` de `package.json`, `Procfile` y `bitbucket-pipelines.yml`.

```
# En cada push a master se dispara el pipeline y su deploy en Heroku
git push origin master
```

Luego de unos minutos la API quedará publicada en https://api-node-ipianetti.herokuapp.com/doc

## Contributing

Formater código con [Prettier](https://prettier.io/) según `.prettierrc` antes de hacer commit:

```
npm run prettier
```
