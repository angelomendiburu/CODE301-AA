## Instrucciones para Copilot y Desarrolladores

Este proyecto utiliza Next.js con el App Router, NextAuth.js para la autenticación y Prisma como ORM. A continuación se detallan los pasos para configurar y ejecutar el proyecto, así como una descripción de la estructura del mismo.

### Configuración del Entorno

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:

    ```env
    # URL de conexión a la base de datos (PostgreSQL)
    DATABASE_URL="postgresql://user:password@host:port/database"

    # Clave secreta para NextAuth.js
    # Puedes generar una con: openssl rand -hex 32
    NEXTAUTH_SECRET="tu-clave-secreta"

    # URL de tu aplicación
    NEXTAUTH_URL="http://localhost:3000"

    # Credenciales de Google OAuth para el inicio de sesión
    GOOGLE_CLIENT_ID="tu-client-id-de-google"
    GOOGLE_CLIENT_SECRET="tu-client-secret-de-google"
    ```

3.  **Aplicar el esquema de la base de datos:**
    ```bash
    npx prisma db push
    ```

### Ejecutar la Aplicación

Para iniciar el servidor de desarrollo, ejecuta:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

### Estructura del Proyecto

*   **`app/`**: Contiene las rutas y los componentes de la aplicación, siguiendo la estructura del App Router de Next.js.
    *   **`app/api/`**: Rutas de la API, incluyendo la ruta de autenticación de NextAuth.js.
    *   **`app/admin/`**: Rutas y componentes específicos para el panel de administración.
    *   **`app/mi-proyecto/`**: Rutas y componentes para el panel de usuario.
    *   **`app/layout.tsx`**: El layout principal de la aplicación.
    *   **`app/providers.tsx`**: Componente que envuelve la aplicación con los proveedores de contexto (como `SessionProvider` de NextAuth.js).
*   **`auth.ts`**: Archivo de configuración de NextAuth.js.
*   **`prisma/`**: Contiene el esquema de la base de datos (`schema.prisma`).
*   **`components/`**: Componentes reutilizables de la interfaz de usuario.
*   **`lib/`**: Librerías y utilidades auxiliares.
*   **`middleware.ts`**: Middleware de Next.js para proteger rutas y gestionar redirecciones.
*   **`scripts/`**: Scripts útiles para el desarrollo (ej. `make-superadmin.ts`).

### Roles de Usuario

El sistema de roles se define en `prisma/schema.prisma` y se utiliza en el middleware y los componentes para controlar el acceso a las diferentes partes de la aplicación.

*   `user`: Rol por defecto para los nuevos usuarios.
*   `admin`: Puede acceder al panel de administración.
*   `superadmin`: Tiene todos los permisos.

Para asignar un rol de `superadmin` a un usuario, puedes utilizar el siguiente script:

```bash
npx ts-node scripts/make-superadmin.ts
```