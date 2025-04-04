# Componentes de Tabla

## Descripción General

Los componentes de tabla proporcionan una forma estructurada de mostrar datos tabulares con funcionalidades avanzadas como ordenación, paginación y filtrado. Estos componentes están diseñados para ser flexibles, accesibles y fáciles de usar.

## Componentes Disponibles

### Table.astro

Componente base que proporciona la estructura principal de la tabla.

**Props:**
- `class`: Clases CSS adicionales
- `id`: ID del elemento

**Ejemplo:**
```astro
<Table>
  <TableHeader>...</TableHeader>
  <TableBody>...</TableBody>
</Table>
```

### TableHeader.astro

Componente para el encabezado de la tabla.

**Props:**
- `class`: Clases CSS adicionales

**Ejemplo:**
```astro
<TableHeader>
  <TableRow>
    <TableCell as="th">ID</TableCell>
    <TableCell as="th">Nombre</TableCell>
  </TableRow>
</TableHeader>
```

### TableBody.astro

Componente para el cuerpo de la tabla.

**Props:**
- `class`: Clases CSS adicionales

**Ejemplo:**
```astro
<TableBody>
  <TableRow>
    <TableCell>1</TableCell>
    <TableCell>Producto 1</TableCell>
  </TableRow>
</TableBody>
```

### TableRow.astro

Componente para las filas de la tabla.

**Props:**
- `class`: Clases CSS adicionales

**Ejemplo:**
```astro
<TableRow>
  <TableCell>1</TableCell>
  <TableCell>Producto 1</TableCell>
</TableRow>
```

### TableCell.astro

Componente para las celdas de la tabla.

**Props:**
- `as`: Tipo de elemento ('td' o 'th')
- `class`: Clases CSS adicionales

**Ejemplo:**
```astro
<TableCell>Contenido</TableCell>
<TableCell as="th">Encabezado</TableCell>
```

### TableSortHeader.astro

Componente para encabezados de tabla con capacidad de ordenación.

**Props:**
- `sortable`: Si la columna es ordenable
- `sortKey`: Clave para ordenar
- `currentSortKey`: Clave actual de ordenación
- `sortDirection`: Dirección de ordenación ('asc', 'desc', null)
- `class`: Clases CSS adicionales

**Ejemplo:**
```astro
<TableSortHeader 
  sortable 
  sortKey="name" 
  currentSortKey="name" 
  sortDirection="asc"
>
  Nombre
</TableSortHeader>
```

### TablePagination.astro

Componente para la paginación de la tabla.

**Props:**
- `currentPage`: Página actual
- `totalItems`: Total de elementos
- `itemsPerPage`: Elementos por página
- `tableId`: ID de la tabla asociada
- `class`: Clases CSS adicionales

**Ejemplo:**
```astro
<TablePagination
  currentPage={1}
  totalItems={100}
  itemsPerPage={10}
  tableId="my-table"
/>
```

### TableFilter.astro

Componente para filtrar datos en la tabla.

**Props:**
- `filterKey`: Clave para el filtro
- `options`: Opciones de filtro
- `currentFilter`: Valor actual del filtro
- `placeholder`: Texto de placeholder para búsqueda
- `searchable`: Si se muestra campo de búsqueda
- `class`: Clases CSS adicionales

**Ejemplo:**
```astro
<TableFilter
  filterKey="category"
  options={[
    { value: "bebidas", label: "Bebidas" },
    { value: "comidas", label: "Comidas" }
  ]}
  placeholder="Buscar..."
  searchable={true}
/>
```

## Ejemplos de Uso

### Tabla Básica

```astro
<Table>
  <TableHeader>
    <TableRow>
      <TableCell as="th">ID</TableCell>
      <TableCell as="th">Nombre</TableCell>
      <TableCell as="th">Precio</TableCell>
    </TableRow>
  </TableHeader>
  <TableBody>
    {products.map(product => (
      <TableRow>
        <TableCell>{product.id}</TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell>${product.price}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Tabla con Ordenación y Paginación

```astro
<div id="product-table">
  <Table>
    <TableHeader>
      <TableRow>
        <TableSortHeader sortable sortKey="id">ID</TableSortHeader>
        <TableSortHeader sortable sortKey="name">Nombre</TableSortHeader>
        <TableSortHeader sortable sortKey="price">Precio</TableSortHeader>
      </TableRow>
    </TableHeader>
    <TableBody>
      {products.map(product => (
        <TableRow>
          <TableCell>{product.id}</TableCell>
          <TableCell>{product.name}</TableCell>
          <TableCell>${product.price}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  
  <TablePagination
    currentPage={1}
    totalItems={products.length}
    itemsPerPage={10}
    tableId="product-table"
  />
</div>
```

### Tabla Completa con Filtros

Ver el ejemplo completo en `src/components/examples/ProductTableWithFilter.astro`.

## Eventos

Los componentes de tabla emiten los siguientes eventos personalizados:

- `table-page-change`: Cuando cambia la página
- `table-filter-change`: Cuando cambia un filtro

## Accesibilidad

Los componentes de tabla están diseñados siguiendo las mejores prácticas de accesibilidad:

- Uso adecuado de elementos semánticos (`<table>`, `<thead>`, `<tbody>`, etc.)
- Atributos ARIA para ordenación (`aria-sort`)
- Navegación por teclado para paginación
- Textos alternativos para iconos

## Personalización

Los componentes de tabla pueden personalizarse mediante:

- Props específicas de cada componente
- Clases CSS adicionales
- Slots para contenido personalizado

## Mejoras Futuras

- Selección de filas
- Exportación de datos (CSV, Excel)
- Columnas redimensionables
- Arrastrar y soltar para reordenar columnas
- Persistencia de estado (localStorage)
