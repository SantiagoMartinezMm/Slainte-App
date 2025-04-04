# Plan de Implementación: Gestión de Pedidos

## Fecha: Abril 2025

Este documento detalla el plan para implementar la gestión de pedidos en la aplicación Slainte-app-astro, que será el próximo paso después de haber completado la gestión de productos y categorías.

## Objetivos

1. Implementar un sistema completo de gestión de pedidos
2. Permitir la creación, visualización, actualización y eliminación de pedidos
3. Facilitar el seguimiento del estado de los pedidos
4. Proporcionar una interfaz intuitiva para el personal del bar/restaurante

## Componentes a Implementar

### 1. Servicios

#### `orderService.ts`
```typescript
// Funciones principales:
- getOrders(): Obtener lista de pedidos con opciones de filtrado y paginación
- getOrderById(): Obtener un pedido específico por ID
- createOrder(): Crear un nuevo pedido
- updateOrder(): Actualizar un pedido existente
- deleteOrder(): Eliminar un pedido
- updateOrderStatus(): Actualizar el estado de un pedido
```

#### `orderItemService.ts`
```typescript
// Funciones principales:
- getOrderItems(): Obtener elementos de un pedido
- addOrderItem(): Añadir un elemento a un pedido
- updateOrderItem(): Actualizar un elemento de pedido
- removeOrderItem(): Eliminar un elemento de pedido
```

### 2. Componentes UI

#### `OrderList.tsx`
- Tabla de pedidos con ordenación, paginación y filtrado
- Visualización de estado de pedidos con indicadores visuales
- Acciones rápidas para cambiar estado
- Filtros por fecha, estado, mesa, etc.

#### `OrderFilters.tsx`
- Filtros para la lista de pedidos
- Búsqueda por ID, cliente, mesa
- Filtro por rango de fechas
- Filtro por estado

#### `OrderForm.tsx`
- Formulario para crear/editar pedidos
- Selección de mesa
- Selección de productos con cantidades
- Cálculo automático de totales
- Notas adicionales

#### `OrderDetail.tsx`
- Vista detallada de un pedido
- Lista de productos con cantidades y precios
- Historial de cambios de estado
- Información de mesa y cliente
- Acciones para cambiar estado

#### `OrderItemManager.tsx`
- Gestión de elementos individuales de un pedido
- Añadir/eliminar productos
- Modificar cantidades
- Aplicar descuentos

### 3. Páginas

#### `/dashboard/orders.astro`
- Página principal de gestión de pedidos
- Lista de pedidos con filtros
- Botón para crear nuevo pedido
- Estadísticas básicas (pedidos pendientes, completados, etc.)

#### `/dashboard/orders/[id].astro`
- Página de detalle de pedido
- Información completa del pedido
- Historial de cambios
- Acciones disponibles según estado

#### `/dashboard/orders/new.astro`
- Página para crear un nuevo pedido
- Formulario completo
- Selección de productos del catálogo

### 4. Flujos de Usuario

#### Crear Pedido
1. Usuario navega a `/dashboard/orders`
2. Usuario hace clic en "Nuevo Pedido"
3. Usuario selecciona mesa (opcional)
4. Usuario añade productos al pedido
5. Usuario establece cantidades
6. Usuario añade notas (opcional)
7. Usuario guarda el pedido
8. Sistema crea el pedido con estado "pendiente"
9. Sistema redirige a la lista de pedidos con confirmación

#### Actualizar Estado de Pedido
1. Usuario navega a `/dashboard/orders`
2. Usuario encuentra el pedido a actualizar
3. Usuario selecciona nuevo estado desde menú desplegable
4. Sistema actualiza el estado
5. Sistema muestra confirmación

#### Ver Detalle de Pedido
1. Usuario navega a `/dashboard/orders`
2. Usuario hace clic en un pedido
3. Sistema muestra página de detalle
4. Usuario puede ver todos los detalles e historial

## Modelo de Datos

Ya tenemos las tablas necesarias en la base de datos:

### Tabla `orders`
- `id`: UUID (clave primaria)
- `table_id`: UUID (referencia a tabla `tables`, opcional)
- `customer_id`: UUID (referencia a tabla `profiles`, opcional)
- `status`: enum `order_status` ('pending', 'preparing', 'ready', 'delivered', 'cancelled')
- `total_amount`: DECIMAL(10, 2)
- `notes`: TEXT
- `created_by`: UUID (referencia a tabla `profiles`)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Tabla `order_items`
- `id`: UUID (clave primaria)
- `order_id`: UUID (referencia a tabla `orders`)
- `product_id`: UUID (referencia a tabla `products`)
- `quantity`: INTEGER
- `unit_price`: DECIMAL(10, 2)
- `notes`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## Consideraciones Técnicas

### Estado Global
- Utilizar Zustand para gestionar el estado de los pedidos activos
- Implementar store para notificaciones de nuevos pedidos

### Optimización
- Implementar paginación del lado del servidor para grandes volúmenes de pedidos
- Utilizar React Query para caché y revalidación de datos

### Seguridad
- Aplicar políticas RLS para asegurar que solo usuarios autorizados puedan gestionar pedidos
- Validar todas las entradas de usuario en cliente y servidor

### Tiempo Real
- Implementar suscripciones de Supabase para actualizaciones en tiempo real de pedidos
- Mostrar notificaciones para nuevos pedidos o cambios de estado

## Plan de Implementación

### Día 1: Servicios y Componentes Básicos
- Implementar `orderService.ts` y `orderItemService.ts`
- Crear componente `OrderList.tsx` básico
- Implementar página `/dashboard/orders.astro`

### Día 2: Formularios y Detalles
- Implementar `OrderForm.tsx` y `OrderItemManager.tsx`
- Crear componente `OrderDetail.tsx`
- Implementar páginas `/dashboard/orders/new.astro` y `/dashboard/orders/[id].astro`

### Día 3: Filtros y Estado
- Implementar `OrderFilters.tsx`
- Añadir funcionalidad de cambio de estado
- Implementar notificaciones para cambios de estado

### Día 4: Integración y Flujos Completos
- Integrar todos los componentes
- Implementar flujos completos de usuario
- Añadir validaciones y manejo de errores

### Día 5: Pruebas y Ajustes
- Realizar pruebas de todos los flujos
- Corregir errores y optimizar rendimiento
- Documentar componentes y funcionalidades

## Métricas de Éxito

1. **Funcionalidad**: Todos los flujos de usuario funcionan correctamente
2. **Rendimiento**: La lista de pedidos carga en menos de 2 segundos
3. **Usabilidad**: El personal puede crear un pedido en menos de 1 minuto
4. **Robustez**: No hay errores al manejar casos extremos (muchos productos, pedidos grandes)
5. **Seguridad**: Solo usuarios autorizados pueden gestionar pedidos

## Conclusión

La implementación de la gestión de pedidos es un paso crucial en el desarrollo de la aplicación Slainte-app-astro. Este plan proporciona una hoja de ruta clara para implementar esta funcionalidad de manera efectiva, asegurando que cumpla con los requisitos del negocio y proporcione una experiencia de usuario óptima.

Una vez completada esta fase, se procederá con la implementación de la gestión de mesas y reservas, seguida por la gestión de inventario, según el plan general del proyecto.
