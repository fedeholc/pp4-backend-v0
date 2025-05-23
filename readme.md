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
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=pp4
DB_TEST_NAME=pp4_test
```

Para correr el backend:

```bash
npm start
```

## Habilitar / deshabilitar JSDoc

Se puede hacer modificando el `jsconfig.json` en la raíz del proyecto. Para habilitarlo, se debe cambiar el `checkJs` a `true`, y para deshabilitarlo, a `false`. Por defecto está en `false`.

También se puede habilitar/deshabilitar individualmente en cada archivo, agregando `//@ts-check` o `// @ts-nocheck` en la primera linea del mismo.
Esto es útil para no tener que estar agregando los tipos a cada archivo, y poder ir haciéndolo de a poco.

OpenAPI es un estándar ampliamente utilizado para describir, documentar y definir APIs RESTful de manera estructurada y legible tanto para humanos como para máquinas. Permite especificar los endpoints, métodos HTTP, parámetros, tipos de datos, respuestas y posibles errores de una API, facilitando la comprensión, el desarrollo, la integración y el mantenimiento de servicios web.

## Testing con Vite

Para asegurar la calidad y el correcto funcionamiento del backend, hemos implementado pruebas automatizadas utilizando Vite y Vitest. Estas pruebas se ejecutan con el comando:

```bash
npm run test
```

Actualmente, el proyecto cuenta con dos tipos principales de pruebas que cubren diferentes aspectos del sistema:

### 1. Pruebas de Servicios (Ej: `clienteService.test.js`)

Estas pruebas se centran en la lógica de negocio encapsulada en los **servicios** y su interacción directa con la base de datos.

- **Tipo de Test**: Se consideran pruebas de **integración a nivel de servicio**. Aunque cada función del servicio se prueba, la interacción con la base de datos (real o de prueba) significa que no están completamente aisladas como en una prueba unitaria pura.
- **Qué se testea**:
  - La correcta ejecución de las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) definidas en cada servicio (por ejemplo, `createCliente`, `getClienteById`, `getAllClientes`, `updateCliente`, `deleteCliente`).
  - La correcta persistencia y recuperación de datos de la base de datos.
  - La validación de los datos devueltos por los servicios contra los esquemas definidos (ej: `ClienteSchema`), asegurando la integridad y estructura de la información.
  - El manejo de casos específicos, como la búsqueda de entidades existentes o inexistentes.
- **Propósito**:
  - Garantizar que la lógica de negocio que manipula los datos funciona como se espera.
  - Detectar tempranamente problemas en las consultas a la base de datos o en la lógica de transformación de datos dentro de los servicios.
  - Proporcionar una red de seguridad al refactorizar la capa de servicios o al modificar el esquema de la base de datos.

### 2. Pruebas de Rutas y Controladores (Ej: `clienteRoutes.test.js`)

Estas pruebas evalúan el comportamiento de la API desde el punto de vista de un cliente, simulando peticiones HTTP a los diferentes endpoints.

- **Tipo de Test**: Son pruebas de **integración de API** (a veces referidas como pruebas end-to-end del backend). Verifican el flujo completo de una solicitud desde que llega al servidor hasta que se emite una respuesta.
- **Qué se testea**:
  - El correcto funcionamiento de cada ruta y método HTTP (GET, POST, PUT, DELETE) definido en la API.
  - La lógica de los controladores, incluyendo cómo procesan las solicitudes y construyen las respuestas.
  - La correcta aplicación de middlewares, especialmente el de autenticación y autorización (por ejemplo, verificar que rutas protegidas requieran un token válido y que ciertos roles tengan los permisos adecuados).
  - Los códigos de estado HTTP devueltos por cada endpoint según el escenario (200, 201, 400, 401, 403, 404, etc.).
  - La estructura y el contenido del cuerpo de las respuestas, validándolos contra los esquemas definidos para asegurar que la API devuelve los datos esperados.
- **Propósito**:
  - Asegurar que los endpoints de la API son accesibles y se comportan según la especificación (definida en `openapi.yaml`).
  - Verificar la correcta integración entre las rutas, los controladores, los servicios y los middlewares.
  - Detectar regresiones o comportamientos inesperados en la API cuando se introducen cambios en el código.
  - Servir como una forma de documentación ejecutable, mostrando cómo interactuar con la API.

Estas pruebas son fundamentales para mantener la estabilidad del backend, facilitar la detección de errores y permitir realizar cambios y nuevas implementaciones con mayor confianza.

## Sobre la documentación de la API

En el archivo openapi.yaml de este proyecto se encuentra la documentación completa de la API del backend, incluyendo:

- **Descripción general del sistema y su versión**: Se detalla el propósito de la API (gestión de áreas, usuarios, clientes, pedidos, facturas, técnicos y autenticación) y la versión actual.
- **Servidor de la API**: Información sobre la URL base del servidor donde la API está disponible.
- **Endpoints (rutas)**: Se listan todas las rutas disponibles para interactuar con los diferentes recursos de la API, como `/areas`, `/usuarios`, `/clientes`, `/pedidos`, `/facturas`, `/tecnicos`, y las rutas de `/auth` para autenticación.
- **Operaciones HTTP**: Para cada endpoint, se especifican los métodos HTTP soportados (por ejemplo, GET, POST, PUT, DELETE), junto con un resumen de lo que hace cada operación.
- **Parámetros**: Se definen los parámetros que pueden o deben ser enviados en las solicitudes, ya sea en la ruta (path), como query string, en cabeceras (headers) o en el cuerpo (body) de la petición.
- **Cuerpos de solicitud (Request Bodies)**: Para operaciones como POST o PUT, se describe la estructura y el tipo de datos esperados en el cuerpo de la solicitud.
- **Respuestas**: Para cada operación, se documentan las posibles respuestas HTTP, incluyendo los códigos de estado (como 200 OK, 201 Created, 400 Bad Request, 404 Not Found), una descripción de lo que significa cada respuesta, y la estructura del cuerpo de la respuesta si la hay.
- **Esquemas (Schemas)**: Bajo la sección `components/schemas`, se definen los modelos de datos utilizados en la API. Esto incluye la estructura de entidades como `Cliente`, `Area`, `Usuario`, `Tecnico`, `Pedido`, `Factura`, `PedidoDisponibilidad`, `PedidoCandidatos`, y `PedidoCompleto`, detallando sus propiedades y tipos de datos.
- **Seguridad**: Se especifica cómo se asegura la API. En este caso, se define un esquema `bearerAuth` (JWT) indicando que la autenticación se realiza mediante tokens Bearer.

Esta documentación es fundamental porque:

- Sirve como un **contrato** entre el frontend (o cualquier cliente) y el backend, definiendo claramente cómo interactuar.
- Facilita el **desarrollo paralelo**, ya que los equipos de frontend y backend pueden trabajar basándose en esta especificación.
- Permite la **generación automática** de documentación interactiva (como Swagger UI o ReDoc), código cliente en diversos lenguajes, y pruebas de API.
- Mejora la **comprensión y mantenibilidad** de la API a lo largo del tiempo.

Okay, aquí tienes una versión del texto redactada como si la estuvieras explicando tú en la documentación del proyecto:

## Pruebas de Endpoints con Rest Client y Postman

Para facilitar la prueba de los endpoints de este backend, he incluido una serie de archivos dentro de la carpeta test-api. Considero que estos archivos son cruciales para verificar el correcto funcionamiento de la API durante el desarrollo y su posterior mantenimiento.

En esta carpeta encontrarán dos tipos principales de archivos:

1.  **Archivos `.http`**: Estos archivos están formateados para ser utilizados con la extensión [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) de Visual Studio Code. Permiten enviar solicitudes HTTP directamente desde el editor de código. Cada archivo `.http` (por ejemplo, `areas.http`, `auth.http`, `cliente.http`, etc.) contiene ejemplos de solicitudes para los endpoints de una entidad específica (Áreas, Autenticación, Clientes, etc.). Esto agiliza el proceso de prueba manual, ya que permiten ejecutar y ver las respuestas de la API sin salir del entorno de desarrollo.

2.  **Archivos `*-postman-collection.json`**: Se trata de colecciones de Postman (por ejemplo, `areas-postman-collection.json`, `auth-postman-collection.json`). Postman es una plataforma muy utilizada para el desarrollo y prueba de APIs. Estas colecciones agrupan las solicitudes de API para cada módulo del backend, lo que posibilita ejecutar pruebas de forma organizada, compartir las configuraciones de las solicitudes con otros desarrolladores y, potencialmente, automatizar pruebas de API más complejas.

En resumen, los archivos que proporciono en la carpeta test-api son herramientas valiosas para:

- **Verificar rápidamente** que los endpoints funcionan como se espera.
- **Depurar problemas** al poder enviar solicitudes específicas y analizar sus respuestas.
- **Documentar con ejemplos prácticos** cómo consumir la API.
- **Facilitar la colaboración** al contar con un conjunto común de pruebas.

Para utilizarlos, es necesario configurar el archivo .env dentro de la carpeta test-api con el `host` y los `tokens` de autenticación correspondientes, tal como se describe en la sección "Probar los endpoints con Rest Client".

## Ejecutar las pruebas de los endpoints con Rest Client

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

## Pruebas End-to-End (E2E) del Frontend con Playwright (Planificadas)

Si bien las pruebas descritas anteriormente se centran en el backend, también tenemos previsto implementar pruebas end-to-end (E2E) para la aplicación frontend. La herramienta elegida para estas pruebas será **Playwright**, aprovechando su capacidad para automatizar navegadores modernos y simular interacciones de usuario complejas a través de la interfaz gráfica, tal como lo haría un usuario final.

**Estado Actual:**

Actualmente, estas pruebas E2E para el frontend **aún no se han implementado**. La razón principal es que la interfaz de usuario (UI) del frontend se encuentra en una fase de desarrollo activo y está sujeta a cambios frecuentes. Realizar pruebas E2E detalladas sobre una UI que evoluciona constantemente resultaría ineficiente, ya que los selectores de elementos y los flujos de usuario podrían romperse con cada modificación visual o estructural.

**Plan Futuro:**

Una vez que la interfaz del frontend alcance un estado más estable y las funcionalidades principales estén consolidadas, procederemos a diseñar y ejecutar los scripts de prueba E2E con **Playwright**. Estas pruebas serán fundamentales para:

- Verificar la correcta integración entre el frontend y el backend desde la perspectiva del usuario.
- Asegurar que los flujos de usuario críticos (como el registro, login, creación de pedidos, etc.) funcionen correctamente de principio a fin.
- Detectar regresiones en la UI o en la interacción con la API que podrían pasar desapercibidas en pruebas más aisladas.

El objetivo es garantizar una experiencia de usuario fluida y sin errores antes de cualquier despliegue a producción.
