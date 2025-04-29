# PP4 - Backend

## Cómo correr el backend

Instalar dependencias:

```bash
npm install
```

Si se quiere modificar la configuración que viene por defecto, crear el archivo `.env`, ej:

```bash
PORT=5000
ADDRESS=localhost
```

Para correr el backend:

```bash
npm start
```

## Probar los endpoints con Rest Client

En el directorio `test-api` están los archivos .http que son los que utiliza la extensión [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) de Visual Studio Code para probar los endpoints.

Dentro de cada archivo están los ejemplos de cada endpoint. Para probarlos, abrir el archivo y hacer click en `Send Request` en la parte superior de cada bloque de código.

Previamente se requiere crear un archiv `.env` dentro de la carpeta `test-api`, ej:

```bash
token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJ0ZXN0dXNlckB0ZXN0LmNvbSIsInJvbCI6ImNsaWVudGUiLCJpYXQiOjE3NDU3NjgyNDQsImV4cCI6MTc0NTc5NzA0NH0.3Plt9auEu9GQ7eAvYIArd03djugtCzJ-8B2Z-sljQng
tokenAdmin = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbCI6ImFkbWluIiwiaWF0IjoxNzQ1Nzc0MzIxLCJleHAiOjE3NDU4MDMxMjF9.UA3A5PgRYaiC1XCDh6LaRTYymtdqeS96T6316fzviZM
host = localhost:5000
```

Allí se debe colocar el host, en coincidencia con el que se haya configurado en el backend, y los tokens de los usuarios que se quieran probar.

Para obtener los tokens se puede user el endpoint de login con uno de los usuarios que ya están creados en la base de datos, y copiar el token que devuelve.

## Testing con vite

Se corren haciendo: `npm run test`

Por ahora hay uno solo que hice para probar si funcionaba la conexión a la base de datos con los endpoints.

## Habilitar / deshabilitar JSDoc

Se puede hacer modificando el `jsconfig.json` en la raíz del proyecto. Para habilitarlo, se debe cambiar el `checkJs` a `true`, y para deshabilitarlo, a `false`. Por defecto está en `false`.

También se puede habilitar/deshabilitar individualmente en cada archivo, agregando `//@ts-check` o `// @ts-nocheck` en la primera linea del mismo.
Esto es útil para no tener que estar agregando los tipos a cada archivo, y poder ir haciéndolo de a poco.
