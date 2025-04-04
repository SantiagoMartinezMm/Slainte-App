# Plan de Implementación - Próximos Pasos

## Fecha: Abril 2025

Este documento detalla los próximos pasos a seguir en el desarrollo del proyecto Slainte-app-astro, enfocándonos en expandir el esquema de base de datos y desarrollar la lógica de negocio principal.

## 1. Expansión del Esquema de Base de Datos

### 1.1 Diseño de Tablas

#### Tabla: products (Productos/Menú)
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    alcohol_percentage DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### Tabla: categories (Categorías de Productos)
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### Tabla: orders (Pedidos)
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES profiles(id),
    table_number INTEGER,
    status TEXT NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### Tabla: order_items (Elementos de Pedido)
```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### Tabla: tables (Mesas)
```sql
CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_number INTEGER NOT NULL UNIQUE,
    capacity INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'available',
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### Tabla: reservations (Reservas)
```sql
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES profiles(id),
    table_id UUID REFERENCES tables(id) NOT NULL,
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    party_size INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### Tabla: inventory (Inventario)
```sql
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    reorder_level INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

#### Tabla: inventory_transactions (Transacciones de Inventario)
```sql
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID REFERENCES inventory(id) NOT NULL,
    transaction_type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### 1.2 Políticas de Seguridad (RLS)

Para cada tabla, implementaremos políticas de seguridad a nivel de fila (RLS) para garantizar que los datos solo sean accesibles por los usuarios autorizados:

```sql
-- Ejemplo para la tabla products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Políticas para productos
CREATE POLICY "Productos visibles para todos"
    ON products FOR SELECT
    USING (true);

CREATE POLICY "Solo administradores pueden modificar productos"
    ON products FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

CREATE POLICY "Solo administradores pueden actualizar productos"
    ON products FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

CREATE POLICY "Solo administradores pueden eliminar productos"
    ON products FOR DELETE
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));
```

Se crearán políticas similares para todas las tablas, adaptadas a los requisitos de acceso específicos.

### 1.3 Índices y Optimizaciones

```sql
-- Índices para mejorar el rendimiento de consultas frecuentes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
```

## 2. Desarrollo de Lógica de Negocio

### 2.1 Gestión de Productos

#### Componentes a Implementar:
- `ProductForm.astro`: Formulario para crear/editar productos
- `ProductList.astro`: Lista de productos con filtros y ordenación
- `ProductDetail.astro`: Vista detallada de un producto
- `CategoryManager.astro`: Gestión de categorías de productos

#### Páginas a Implementar:
- `/admin/products`: Gestión de productos
- `/admin/products/new`: Crear nuevo producto
- `/admin/products/[id]`: Editar producto existente
- `/admin/categories`: Gestión de categorías

### 2.2 Gestión de Pedidos

#### Componentes a Implementar:
- `OrderForm.astro`: Formulario para crear/editar pedidos
- `OrderList.astro`: Lista de pedidos con filtros y ordenación
- `OrderDetail.astro`: Vista detallada de un pedido
- `OrderItemManager.astro`: Gestión de elementos de pedido

#### Páginas a Implementar:
- `/admin/orders`: Gestión de pedidos
- `/admin/orders/new`: Crear nuevo pedido
- `/admin/orders/[id]`: Ver/editar pedido existente
- `/staff/orders`: Vista de pedidos para personal

### 2.3 Gestión de Mesas y Reservas

#### Componentes a Implementar:
- `TableManager.astro`: Gestión de mesas
- `ReservationForm.astro`: Formulario para crear/editar reservas
- `ReservationList.astro`: Lista de reservas con filtros y ordenación
- `ReservationCalendar.astro`: Vista de calendario de reservas

#### Páginas a Implementar:
- `/admin/tables`: Gestión de mesas
- `/admin/reservations`: Gestión de reservas
- `/admin/reservations/new`: Crear nueva reserva
- `/admin/reservations/[id]`: Ver/editar reserva existente
- `/reservations`: Página pública para realizar reservas

### 2.4 Gestión de Inventario

#### Componentes a Implementar:
- `InventoryManager.astro`: Gestión de inventario
- `InventoryTransactionForm.astro`: Formulario para registrar transacciones
- `InventoryReport.astro`: Informes de inventario

#### Páginas a Implementar:
- `/admin/inventory`: Gestión de inventario
- `/admin/inventory/transactions`: Historial de transacciones
- `/admin/inventory/reports`: Informes de inventario

## 3. Implementación de Pruebas

### 3.1 Pruebas Unitarias
- Pruebas para componentes UI
- Pruebas para funciones de utilidad
- Pruebas para lógica de negocio

### 3.2 Pruebas de Integración
- Pruebas para flujos de trabajo completos
- Pruebas para interacciones con la base de datos

### 3.3 Pruebas E2E
- Pruebas para flujos de usuario completos
- Pruebas para escenarios críticos de negocio

## 4. Cronograma Estimado

### Semana 1: Esquema de Base de Datos
- Día 1-2: Implementación de tablas de productos y categorías
- Día 3-4: Implementación de tablas de pedidos y elementos de pedido
- Día 5: Implementación de tablas de mesas y reservas

### Semana 2: Gestión de Productos y Pedidos
- Día 1-2: Implementación de gestión de productos
- Día 3-5: Implementación de gestión de pedidos

### Semana 3: Gestión de Mesas, Reservas e Inventario
- Día 1-2: Implementación de gestión de mesas y reservas
- Día 3-4: Implementación de gestión de inventario
- Día 5: Pruebas y ajustes

### Semana 4: Pruebas y Optimización
- Día 1-2: Implementación de pruebas unitarias
- Día 3-4: Implementación de pruebas de integración
- Día 5: Optimización y documentación

## 5. Recursos Necesarios

- Acceso a la base de datos Supabase
- Documentación de Astro y React
- Herramientas de prueba (Vitest)
- Diseños UI/UX para las nuevas páginas

## 6. Riesgos y Mitigaciones

| Riesgo | Impacto | Probabilidad | Mitigación |
|--------|---------|--------------|------------|
| Cambios en requisitos | Alto | Media | Mantener comunicación constante con stakeholders |
| Problemas de rendimiento | Medio | Baja | Implementar optimizaciones y monitoreo |
| Errores en la lógica de negocio | Alto | Media | Pruebas exhaustivas y revisión de código |
| Problemas de integración | Medio | Media | Implementar CI/CD y pruebas automatizadas |

## 7. Conclusión

Este plan proporciona una hoja de ruta clara para los próximos pasos en el desarrollo del proyecto Slainte-app-astro. La implementación se realizará de manera incremental, comenzando con la expansión del esquema de base de datos y continuando con el desarrollo de la lógica de negocio principal.

La prioridad será establecer una base de datos sólida que soporte todas las funcionalidades requeridas, seguida por la implementación de las funcionalidades principales de gestión de productos, pedidos, mesas, reservas e inventario.
