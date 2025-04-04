-- Migración para crear tablas de inventario
-- Fecha: Abril 2025

-- Crear enum para tipos de transacción de inventario
CREATE TYPE inventory_transaction_type AS ENUM ('purchase', 'sale', 'adjustment', 'waste');

-- Crear tabla de inventario
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    reorder_level INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de transacciones de inventario
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID REFERENCES inventory(id) NOT NULL,
    transaction_type inventory_transaction_type NOT NULL,
    quantity INTEGER NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para inventario
CREATE POLICY "Inventario visible para administradores y personal"
    ON inventory FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role IN ('admin', 'staff')
    ));

CREATE POLICY "Solo administradores pueden crear registros de inventario"
    ON inventory FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

CREATE POLICY "Solo administradores pueden actualizar inventario"
    ON inventory FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

CREATE POLICY "Solo administradores pueden eliminar registros de inventario"
    ON inventory FOR DELETE
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

-- Políticas para transacciones de inventario
CREATE POLICY "Transacciones visibles para administradores y personal"
    ON inventory_transactions FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role IN ('admin', 'staff')
    ));

CREATE POLICY "Administradores pueden crear transacciones"
    ON inventory_transactions FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

CREATE POLICY "Personal puede crear transacciones de venta y desperdicio"
    ON inventory_transactions FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT id FROM profiles WHERE role = 'staff'
        ) AND
        transaction_type IN ('sale', 'waste')
    );

-- Crear índices
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_inventory_transactions_inventory_id ON inventory_transactions(inventory_id);
CREATE INDEX idx_inventory_transactions_created_by ON inventory_transactions(created_by);
CREATE INDEX idx_inventory_transactions_type ON inventory_transactions(transaction_type);

-- Triggers para actualizar updated_at
CREATE TRIGGER update_inventory_updated_at
    BEFORE UPDATE ON inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar la cantidad en inventario cuando se registra una transacción
CREATE OR REPLACE FUNCTION update_inventory_quantity()
RETURNS TRIGGER AS $$
DECLARE
    factor INTEGER;
BEGIN
    -- Determinar si la transacción aumenta o disminuye el inventario
    IF NEW.transaction_type IN ('purchase', 'adjustment') AND NEW.quantity > 0 THEN
        factor := 1; -- Aumenta el inventario
    ELSE
        factor := -1; -- Disminuye el inventario
    END IF;
    
    -- Actualizar la cantidad en inventario
    UPDATE inventory
    SET quantity = quantity + (NEW.quantity * factor)
    WHERE id = NEW.inventory_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar la cantidad en inventario
CREATE TRIGGER update_inventory_quantity_on_transaction
    AFTER INSERT ON inventory_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_quantity();

-- Función para verificar si hay suficiente inventario para una transacción de salida
CREATE OR REPLACE FUNCTION check_inventory_availability()
RETURNS TRIGGER AS $$
DECLARE
    current_quantity INTEGER;
BEGIN
    -- Solo verificar para transacciones que disminuyen el inventario
    IF NEW.transaction_type IN ('sale', 'waste') OR (NEW.transaction_type = 'adjustment' AND NEW.quantity < 0) THEN
        -- Obtener la cantidad actual en inventario
        SELECT quantity INTO current_quantity
        FROM inventory
        WHERE id = NEW.inventory_id;
        
        -- Verificar si hay suficiente inventario
        IF current_quantity < ABS(NEW.quantity) THEN
            RAISE EXCEPTION 'No hay suficiente inventario disponible';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar disponibilidad de inventario
CREATE TRIGGER check_inventory_availability_on_transaction
    BEFORE INSERT ON inventory_transactions
    FOR EACH ROW
    EXECUTE FUNCTION check_inventory_availability();
