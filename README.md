# EVT - Aplicación de Gestión de Despachos y Ventas (DevOps)

## 1. Descripción General del Proyecto

El presente proyecto implementa una solución logística y comercial contenerizada para la gestión integrada de órdenes de compra y órdenes de despacho. La arquitectura del sistema está basada en microservicios independientes desplegados y orquestados mediante Docker Compose, separando las capas de presentación, lógica de negocio y persistencia de datos.

---

## 2. Arquitectura y Tecnologías

El sistema se compone de los siguientes contenedores y servicios:

* **Frontend (Proxy Inverso y Web App)**: Aplicación web desarrollada con React, Vite y Tailwind CSS, compilada y servida mediante Nginx en un contenedor Alpine Linux. Nginx actúa asimismo como proxy inverso para enrutar de manera transparente las peticiones de la interfaz hacia los microservicios correspondientes (`/api/v1/ventas` y `/api/v1/despachos`).
* **Microservicio de Ventas (`ms-ventas`)**: API REST desarrollada en Java 17 con Spring Boot y Spring Data JPA. Gestiona el ciclo de vida, registro, valorización y estado de las órdenes de compra.
* **Microservicio de Despachos (`ms-despacho`)**: API REST desarrollada en Java 17 con Spring Boot y Spring Data JPA. Administra la logística, asignación de vehículos, intentos de entrega y cierre de órdenes de despacho.
* **Base de Datos (`mysql`)**: Instancia de MySQL 8.0 configurada con inicialización automática mediante scripts en la carpeta `db/init/`, aprovisionando bases de datos segregadas (`bd_ventas` y `bd_despachos`) con sus respectivos usuarios con privilegios limitados.

---

## 3. Prerrequisitos del Sistema

Para desplegar y ejecutar el proyecto en un entorno local o de servidor, se requiere contar con:

1. **Docker Engine**: Versión 20.10 o superior.
2. **Docker Compose**: Versión 2.0 o superior.
3. **Disponibilidad de Puertos**: Verificar que los siguientes puertos del host no estén en uso por otras aplicaciones:
   * **8090**: Acceso a la interfaz web (Frontend).
   * **8081**: Acceso directo al microservicio de Despachos.
   * **8082**: Acceso directo al microservicio de Ventas.
   * **3307**: Acceso al motor de base de datos MySQL.

---

## 4. Instrucciones de Despliegue Paso a Paso

### Paso 1: Configuración de Variables de Entorno
Antes de iniciar los servicios, es obligatorio generar y verificar el archivo de variables de entorno del sistema.

1. En la raíz del repositorio, copia el archivo de plantilla `.env.example` a un nuevo archivo llamado `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edita el archivo `.env` según los requerimientos del entorno. Los valores por defecto preconfigurados son los siguientes:
   ```env
   MYSQL_ROOT_PASSWORD=changeme
   DESPACHO_DB_NAME=bd_despachos
   DESPACHO_DB_USER=despacho_user
   DESPACHO_DB_PASSWORD=changeme
   VENTAS_DB_NAME=bd_ventas
   VENTAS_DB_USER=ventas_user
   VENTAS_DB_PASSWORD=changeme
   MS_DESPACHO_PORT=8081
   MS_VENTAS_PORT=8082
   FRONTEND_PORT=8090
   MYSQL_HOST_PORT=3307
   ```

### Paso 2: Construcción y Ejecución de Contenedores
Para compilar las imágenes de los microservicios e iniciar todos los contenedores en segundo plano (modo detached), ejecuta el siguiente comando en la raíz de la infraestructura:

```bash
docker-compose up -d --build
```

* **Explicación de parámetros:**
  * `-d` (`--detach`): Ejecuta los contenedores en segundo plano y libera el terminal.
  * `--build`: Fuerza la compilación del código fuente de React y Java antes de levantar las instancias.

### Paso 3: Verificación del Estado de la Infraestructura
El orden de inicio está gestionado automáticamente mediante condiciones de salud (`healthcheck`). El contenedor MySQL se inicializa en primer lugar; los microservicios de Java esperan hasta que la condición `service_healthy` de la base de datos sea satisfactoria.

Para comprobar el estado de los servicios en ejecución:

```bash
docker-compose ps
```

El resultado esperado debe indicar que los cuatro contenedores se encuentran en estado `Up` (y `mysql` en estado `Up (healthy)`).

### Paso 4: Acceso a la Aplicación
Una vez que todos los contenedores reporten un estado operativo normal, puedes acceder al sistema a través de un navegador web en la siguiente dirección:

* **Interfaz de Gestión Web (Frontend):** `http://localhost:8090/`

---

## 5. Gestión y Mantenimiento de Servicios

### Consulta de Registros y Logs del Sistema
Para supervisar la actividad general de todos los servicios en tiempo real:
```bash
docker-compose logs -f
```

Para inspeccionar los registros de un microservicio en específico:
```bash
docker-compose logs -f ms-ventas
docker-compose logs -f ms-despacho
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Reinicio de Contenedores
Si necesitas reiniciar un servicio particular tras modificar variables u operaciones en caliente:
```bash
docker-compose restart frontend
```

### Detención y Eliminación del Entorno
Para detener todos los servicios activos conservando los datos almacenados en los volúmenes:
```bash
docker-compose stop
```

Para detener, desmontar la red virtual y **eliminar los contenedores**:
```bash
docker-compose down
```

Para eliminar los contenedores y **borrar permanentemente las bases de datos** (limpieza completa del volumen `mysql-data`):
```bash
docker-compose down -v
```

### Acceso Interno a los Contenedores por Consola
Para ingresar a la terminal interna de un contenedor mediante shell bash:
```bash
docker exec -it app-despachos-mysql-1 mysql -u root -p
```

---

## 6. Estructura de Endpoints de la API REST

A través del proxy inverso de Nginx (`http://localhost:8090`), la aplicación expone los siguientes puntos de enlace principales:

### Microservicio de Ventas (`/api/v1/ventas`)
* `GET /api/v1/ventas`: Obtiene el listado completo de órdenes de compra registradas.
* `GET /api/v1/ventas/{id}`: Obtiene el detalle de una orden de compra por su identificador.
* `POST /api/v1/ventas`: Registra una nueva venta en el sistema.
* `PUT /api/v1/ventas/{id}`: Actualiza los datos de una venta existente.
* `DELETE /api/v1/ventas/{id}`: Elimina un registro de venta.

### Microservicio de Despachos (`/api/v1/despachos`)
* `GET /api/v1/despachos`: Obtiene el listado de órdenes de despacho operativas.
* `GET /api/v1/despachos/{id}`: Consulta el estado e intentos de entrega de un despacho.
* `POST /api/v1/despachos`: Crea una nueva orden de despacho asociada a una compra.
* `PUT /api/v1/despachos/{id}`: Modifica un despacho (dirección, patente, intentos fallidos o cierre).
* `DELETE /api/v1/despachos/{id}`: Elimina un despacho de la base de datos.

---

## 7. Solución de Problemas Frecuentes (Troubleshooting)

1. **Demora inicial en la carga de datos web (`No hay ventas registradas`)**
   * **Causa**: Al ejecutar `docker-compose up -d`, la máquina virtual de Java (Spring Boot) requiere de 20 a 30 segundos para conectar al pool de base de datos e inicializar el servidor Tomcat. Si se accede al portal durante este intervalo, la consulta del frontend puede devolver una lista vacía por espera del servidor.
   * **Solución**: Utiliza el botón de **Actualizar** en el panel superior del frontend para refrescar la consulta sin recargar el navegador tan pronto como los microservicios finalicen su arranque en el puerto 8081 y 8082.

2. **Errores de ejecución en scripts de base de datos (`/bin/bash^M: bad interpreter`)**
   * **Causa**: El uso de saltos de línea estilo Windows (`CRLF`) en los archivos de inicialización `.sh` y `.sql` genera errores de lectura en los contenedores basados en Linux.
   * **Solución**: El repositorio cuenta con un archivo `.gitattributes` para forzar el salto de línea `LF`. Si se presentan problemas al inicializar MySQL, asegúrate de guardar los scripts de la carpeta `db/init/` utilizando el formato de salto de línea Unix (`LF`).
