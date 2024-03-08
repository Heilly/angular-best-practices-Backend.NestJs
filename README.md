# Backend en Nest

## Run
  <code>npm run start:dev</code>
  ```
  docker compose up -d
  ```
  Copiar el ```.env.template``` y renombrarlo a ```.env```

# Pasos para la creación
## Eliminar errores por espaciados
  <code>npm uninstall prettier eslint-config-prettier eslint-plugin-prettier</code>

## Configuración MongoDB + Docker
  <p>Instalar Mongo Compas para ver las bases de datos</p>

### En la raíz de mi documento crear el fichero:
  <code>version: '3'
      services:
        db:
          container_name: meand-db
          image: mongo:5.0.16
          volumes:
            - ./mongo:/data/db
          ports:
            - 27017:27017
          restart: always
  </code>



# angular-best-practices-Backend.NestJs
