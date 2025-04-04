import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils'; // Asumiendo que cn está configurado

// Tipo para las opciones del select (puede compartirse si se mueve a un archivo types)
interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// Props para el componente Select de React
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  name: string; // Obligatorio para react-hook-form
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
  labelClassName?: string;
  // 'error' se obtiene del contexto
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  options = [],
  placeholder,
  containerClassName,
  labelClassName,
  className, // Clases para el select mismo
  required,
  ...props // Resto de props (value, disabled, etc.)
}) => {
  const { register, formState: { errors } } = useFormContext();
  const fieldError = errors[name]?.message as string | undefined;

  // Estilos (adaptados de Select.astro)
  const baseSelectStyles = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
  const errorSelectStyles = fieldError ? "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500" : "";
  const disabledSelectStyles = props.disabled ? "cursor-not-allowed bg-gray-100 dark:bg-gray-600 opacity-50" : "";

  const baseLabelStyles = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
  const errorTextStyles = "mt-2 text-sm text-red-600 dark:text-red-500";

  return (
    <div className={cn("mb-4", containerClassName)}>
      {label && (
        <label htmlFor={props.id || name} className={cn(baseLabelStyles, labelClassName)}>
          {label}
          {required && <span className="text-red-500 ms-1">*</span>}
        </label>
      )}
      <select
        id={props.id || name}
        className={cn(
          baseSelectStyles,
          errorSelectStyles,
          disabledSelectStyles,
          className
        )}
        // Registrar el select con react-hook-form
        {...register(name, { required: required ? `${label || name} es requerido` : false })}
        aria-invalid={fieldError ? 'true' : 'false'}
        aria-describedby={fieldError ? `${name}-error` : undefined}
        {...props} // Pasar value, disabled, etc.
      >
        {placeholder && (
          // Eliminado 'selected' explícito; el navegador seleccionará la primera opción deshabilitada por defecto si no hay valor
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {fieldError && (
        <p id={`${name}-error`} className={cn(errorTextStyles)}>
          {fieldError}
        </p>
      )}
    </div>
  );
};

export default Select;

// Asegurar que es tratado como módulo
export {};
