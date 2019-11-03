# Creating a Rest API with JWT authentication and role based authorization using TypeScript…

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

## Contributing

Formater código con [Prettier](https://prettier.io/) según `.prettierrc` antes de hacer commit:
```             
npm run prettier
```
