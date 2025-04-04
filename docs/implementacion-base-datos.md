# Implementación del Esquema de Base de Datos

## Fecha: Abril 2025

Este documento describe la implementación del esquema de base de datos para el proyecto Slainte-app-astro, incluyendo las tablas creadas, las relaciones entre ellas y las políticas de seguridad implementadas.

## Tablas Implementadas

### 1. Productos y Categorías

#### Tabla: categories
- **Propósito**: Almacenar las categorías de productos (bebidas, cocteles, etc.)
- **Campos principales**:
  - `id`: Identificador único
  - `name`: Nombre de la categoría
  - `description`: Descripción opcional
  - `image_url`: URL de la imagen representativa

#### Tabla: products
- **Propósito**: Almacenar los productos disponibles en el menú
- **Campos principales**:
  - `id`: Identificador único
  - `name`: Nombre del producto
  - `description`: Descripción detallada
  - `price`: Precio del producto
  - `category_id`: Referencia a la categoría
  - `is_available`: Indica si el producto está disponible
  - `alcohol_percentage`: Porcentaje de alcohol (para bebidas)

### 2. Pedidos

#### Tabla: orders
- **Propósito**: Almacenar los pedidos realizados por los clientes
- **Campos principales**:
  - `id`: Identificador único
  - `customer_id`: Referencia al cliente (opcional)
  - `table_number`: Número de mesa (opcional)
  - `status`: Estado del pedido (pendiente, preparando, listo, entregado, cancelado)
  - `total_amount`: Monto total del pedido
  - `notes`: Notas adicionales

#### Tabla: order_items
- **Propósito**: Almacenar los elementos individuales de cada pedido
- **Campos principales**:
  - `id`: Identificador único
  - `order_id`: Referencia al pedido
  - `product_id`: Referencia al producto
  - `quantity`: Cantidad solicitada
  - `unit_price`: Precio unitario al momento de la compra
  - `notes`: Instrucciones especiales

### 3. Mesas y Reservas

#### Tabla: tables
- **Propósito**: Almacenar información sobre las mesas del establecimiento
- **Campos principales**:
  - `id`: Identificador único
  - `table_number`: Número de mesa
  - `capacity`: Capacidad (número de personas)
  - `status`: Estado de la mesa (disponible, ocupada, reservada, mantenimiento)
  - `location`: Ubicación dentro del establecimiento

#### Tabla: reservations
- **Propósito**: Gestionar las reservas de mesas
- **Campos principales**:
  - `id`: Identificador único
  - `customer_id`: Referencia al cliente
  - `table_id`: Referencia a la mesa
  - `reservation_date`: Fecha de la reserva
  - `start_time`: Hora de inicio
  - `end_time`: Hora de finalización
  - `party_size`: Tamaño del grupo
  - `status`: Estado de la reserva (pendiente, confirmada, cancelada, completada)

### 4. Inventario

#### Tabla: inventory
- **Propósito**: Controlar el inventario de productos
- **Campos principales**:
  - `id`: Identificador único
  - `product_id`: Referencia al producto
  - `quantity`: Cantidad disponible
  - `unit`: Unidad de medida
  - `reorder_level`: Nivel mínimo para reordenar

#### Tabla: inventory_transactions
- **Propósito**: Registrar movimientos de inventario
- **Campos principales**:
  - `id`: Identificador único
  - `inventory_id`: Referencia al inventario
  - `transaction_type`: Tipo de transacción (compra, venta, ajuste, desperdicio)
  - `quantity`: Cantidad afectada
  - `created_by`: Usuario que realizó la transacción

## Relaciones entre Tablas

1. **Productos y Categorías**:
   - Un producto pertenece a una categoría (relación muchos a uno)

2. **Pedidos y Elementos de Pedido**:
   - Un pedido contiene múltiples elementos (relación uno a muchos)
   - Cada elemento de pedido se refiere a un producto específico

3. **Mesas y Reservas**:
   - Una mesa puede tener múltiples reservas en diferentes momentos (relación uno a muchos)
   - Una reserva se asocia a una mesa específica

4. **Productos e Inventario**:
   - Cada registro de inventario se asocia a un producto específico
   - Las transacciones de inventario se asocian a registros de inventario

5. **Usuarios y Entidades**:
   - Los pedidos, reservas y transacciones de inventario se asocian a usuarios específicos

## Políticas de Seguridad (RLS)

Se han implementado políticas de seguridad a nivel de fila (Row Level Security) para garantizar que los datos solo sean accesibles por los usuarios autorizados:

### Categorías y Productos
- **Lectura**: Visible para todos los usuarios
- **Escritura**: Restringida a administradores

### Pedidos y Elementos de Pedido
- **Lectura**:
  - Administradores: Todos los pedidos
  - Personal: Todos los pedidos
  - Clientes: Solo sus propios pedidos
- **Escritura**:
  - Administradores: Todos los pedidos
  - Personal: Todos los pedidos
  - Clientes: Solo sus propios pedidos pendientes

### Mesas y Reservas
- **Mesas**:
  - Lectura: Visible para todos los usuarios
  - Escritura: Restringida a administradores
- **Reservas**:
  - Lectura:
    - Administradores: Todas las reservas
    - Personal: Todas las reservas
    - Clientes: Solo sus propias reservas
  - Escritura:
    - Administradores: Todas las reservas
    - Personal: Todas las reservas
    - Clientes: Solo sus propias reservas pendientes

### Inventario
- **Lectura**: Restringida a administradores y personal
- **Escritura**: Restringida a administradores
- **Transacciones**:
  - Administradores: Todos los tipos de transacciones
  - Personal: Solo transacciones de venta y desperdicio

## Funciones y Triggers

Se han implementado varias funciones y triggers para mantener la integridad de los datos:

1. **Actualización de Timestamps**:
   - Actualiza automáticamente el campo `updated_at` cuando se modifica un registro

2. **Cálculo de Total de Pedido**:
   - Actualiza automáticamente el total del pedido cuando se añaden, modifican o eliminan elementos

3. **Verificación de Disponibilidad de Mesas**:
   - Evita conflictos de reservas para la misma mesa en el mismo horario

4. **Gestión de Inventario**:
   - Actualiza automáticamente las cantidades de inventario cuando se registran transacciones
   - Verifica que haya suficiente inventario para transacciones de salida

## Índices

Se han creado índices para optimizar las consultas más frecuentes:

- `idx_products_category_id`: Para búsquedas de productos por categoría
- `idx_orders_customer_id`: Para búsquedas de pedidos por cliente
- `idx_orders_status`: Para filtrar pedidos por estado
- `idx_order_items_order_id`: Para obtener los elementos de un pedido
- `idx_reservations_date`: Para búsquedas de reservas por fecha
- `idx_inventory_product_id`: Para búsquedas de inventario por producto

## Tipos Enumerados

Se han definido varios tipos enumerados para garantizar la consistencia de los datos:

- `order_status`: Estados posibles de un pedido
- `table_status`: Estados posibles de una mesa
- `reservation_status`: Estados posibles de una reserva
- `inventory_transaction_type`: Tipos de transacciones de inventario

## Integración con TypeScript

Se ha actualizado el archivo `src/lib/database.types.ts` para incluir definiciones de tipos TypeScript para todas las tablas y enumeraciones, lo que proporciona autocompletado y verificación de tipos al interactuar con la base de datos desde el código.

## Próximos Pasos

1. **Implementación de Componentes UI**:
   - Crear formularios para gestionar productos, categorías, pedidos, etc.
   - Implementar vistas para visualizar y filtrar datos

2. **Desarrollo de Lógica de Negocio**:
   - Implementar flujos de trabajo para la gestión de pedidos
   - Desarrollar lógica para reservas y gestión de mesas
   - Implementar sistema de inventario

3. **Pruebas**:
   - Crear pruebas para verificar la integridad de los datos
   - Probar las políticas de seguridad
   - Verificar el rendimiento de las consultas
