-- Migración para crear tablas de mesas y reservas
-- Fecha: Abril 2025

-- Crear enum para estados de mesa
CREATE TYPE table_status AS ENUM ('available', 'occupied', 'reserved', 'maintenance');

-- Crear enum para estados de reserva
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Crear tabla de mesas
CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_number INTEGER NOT NULL UNIQUE,
    capacity INTEGER NOT NULL,
    status table_status NOT NULL DEFAULT 'available',
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de reservas
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES profiles(id),
    table_id UUID REFERENCES tables(id) NOT NULL,
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    party_size INTEGER NOT NULL,
    status reservation_status NOT NULL DEFAULT 'confirmed',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Políticas para mesas
CREATE POLICY "Mesas visibles para todos"
    ON tables FOR SELECT
    USING (true);

CREATE POLICY "Solo administradores pueden crear mesas"
    ON tables FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

CREATE POLICY "Solo administradores pueden actualizar mesas"
    ON tables FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

CREATE POLICY "Solo administradores pueden eliminar mesas"
    ON tables FOR DELETE
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

-- Políticas para reservas
CREATE POLICY "Administradores pueden ver todas las reservas"
    ON reservations FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

CREATE POLICY "Personal puede ver todas las reservas"
    ON reservations FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'staff'
    ));

CREATE POLICY "Clientes solo pueden ver sus propias reservas"
    ON reservations FOR SELECT
    USING (
        auth.uid() = customer_id OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Administradores y personal pueden crear reservas"
    ON reservations FOR INSERT
    WITH CHECK (auth.uid() IN (
        SELECT id FROM profiles WHERE role IN ('admin', 'staff')
    ));

CREATE POLICY "Clientes pueden crear sus propias reservas"
    ON reservations FOR INSERT
    WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Administradores y personal pueden actualizar reservas"
    ON reservations FOR UPDATE
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role IN ('admin', 'staff')
    ));

CREATE POLICY "Clientes solo pueden actualizar sus reservas pendientes"
    ON reservations FOR UPDATE
    USING (
        auth.uid() = customer_id AND
        status = 'pending'
    );

CREATE POLICY "Administradores pueden eliminar reservas"
    ON reservations FOR DELETE
    USING (auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'admin'
    ));

CREATE POLICY "Clientes pueden cancelar sus propias reservas"
    ON reservations FOR UPDATE
    USING (
        auth.uid() = customer_id AND
        status IN ('pending', 'confirmed') AND
        NEW.status = 'cancelled'
    );

-- Crear índices
CREATE INDEX idx_tables_status ON tables(status);
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_customer_id ON reservations(customer_id);
CREATE INDEX idx_reservations_table_id ON reservations(table_id);
CREATE INDEX idx_reservations_status ON reservations(status);

-- Triggers para actualizar updated_at
CREATE TRIGGER update_tables_updated_at
    BEFORE UPDATE ON tables
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para verificar disponibilidad de mesa al crear/actualizar reservas
CREATE OR REPLACE FUNCTION check_table_availability()
RETURNS TRIGGER AS $$
DECLARE
    conflicting_reservations INTEGER;
BEGIN
    -- Verificar si hay reservas que se solapan para la misma mesa
    SELECT COUNT(*)
    INTO conflicting_reservations
    FROM reservations
    WHERE 
        table_id = NEW.table_id AND
        reservation_date = NEW.reservation_date AND
        id != NEW.id AND
        status IN ('pending', 'confirmed') AND
        (
            (start_time <= NEW.start_time AND end_time > NEW.start_time) OR
            (start_time < NEW.end_time AND end_time >= NEW.end_time) OR
            (start_time >= NEW.start_time AND end_time <= NEW.end_time)
        );
    
    IF conflicting_reservations > 0 THEN
        RAISE EXCEPTION 'La mesa ya está reservada en ese horario';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar disponibilidad al crear/actualizar reservas
CREATE TRIGGER check_table_availability_on_insert
    BEFORE INSERT ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION check_table_availability();

CREATE TRIGGER check_table_availability_on_update
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    WHEN (
        OLD.table_id != NEW.table_id OR
        OLD.reservation_date != NEW.reservation_date OR
        OLD.start_time != NEW.start_time OR
        OLD.end_time != NEW.end_time OR
        OLD.status != NEW.status
    )
    EXECUTE FUNCTION check_table_availability();

-- Insertar algunas mesas de ejemplo
INSERT INTO tables (table_number, capacity, location)
VALUES 
    (1, 2, 'Ventana'),
    (2, 2, 'Ventana'),
    (3, 4, 'Centro'),
    (4, 4, 'Centro'),
    (5, 6, 'Terraza'),
    (6, 8, 'Salón privado');
