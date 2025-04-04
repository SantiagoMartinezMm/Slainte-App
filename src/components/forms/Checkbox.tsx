import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils'; // Asumiendo que cn está configurado

// Props para el componente Checkbox de React
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  label: string; // Etiqueta es requerida
  name: string; // Obligatorio para react-hook-form
  value?: string; // Valor opcional enviado si está marcado
  containerClassName?: string;
  labelClassName?: string;
  // 'error' se obtiene del contexto
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  name,
  value,
  containerClassName,
  labelClassName,
  className, // Clases para el input mismo
  required,
  ...props // Resto de props (checked, disabled, etc.)
}) => {
  const { register, formState: { errors } } = useFormContext();
  // Los errores para checkboxes individuales son menos comunes, pero se pueden manejar si es necesario
  const fieldError = errors[name]?.message as string | undefined;

  // Estilos (adaptados de Checkbox.astro)
  const baseInputStyles = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600";
  const disabledInputStyles = props.disabled ? "cursor-not-allowed opacity-50" : "";
  const baseLabelStyles = "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300";
  const disabledLabelStyles = props.disabled ? "cursor-not-allowed opacity-50" : "";
  const errorTextStyles = "mt-1 text-sm text-red-600 dark:text-red-500";

  return (
    <div className={cn("flex items-center mb-4", containerClassName)}>
      <input
        type="checkbox"
        id={props.id || name}
        value={value} // Valor que se envía si está marcado
        className={cn(
          baseInputStyles,
          disabledInputStyles,
          className
        )}
        // Registrar el checkbox con react-hook-form
        {...register(name, { required: required ? `${label || name} debe ser aceptado` : false })}
        aria-invalid={fieldError ? 'true' : 'false'}
        aria-describedby={fieldError ? `${name}-error` : undefined}
        {...props} // Pasar checked, disabled, etc.
      />
      <label
        htmlFor={props.id || name}
        className={cn(
          baseLabelStyles,
          disabledLabelStyles,
          labelClassName
        )}
      >
        {label}
      </label>
      {/* Mensaje de error (opcional) */}
      {fieldError && (
        <p id={`${name}-error`} className={cn(errorTextStyles, "w-full mt-1 ms-6")}>
          {fieldError}
        </p>
      )}
    </div>
  );
};

export default Checkbox;

// Asegurar que es tratado como módulo
export {};
