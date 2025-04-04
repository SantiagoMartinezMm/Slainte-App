import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils'; // Asumiendo que cn (de clsx/tailwind-merge) está configurado en utils

// Props para el componente Input de React
// Extendemos los atributos estándar de input HTML
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string; // name es obligatorio para react-hook-form
  containerClassName?: string; // Clases para el div contenedor
  labelClassName?: string; // Clases para la etiqueta
  // No necesitamos pasar 'error' como prop, lo obtendremos del contexto
}

export const Input: React.FC<InputProps> = ({
  label,
  name,
  type = 'text',
  containerClassName,
  labelClassName,
  className, // Clases para el input mismo
  required, // react-hook-form maneja 'required' a través de reglas de validación
  ...props // Resto de props van al input
}) => {
  // Obtener métodos y estado del contexto de react-hook-form
  const { register, formState: { errors } } = useFormContext();

  // Buscar error específico para este campo
  const fieldError = errors[name]?.message as string | undefined;

  // Estilos base (adaptados de Input.astro)
  const baseInputStyles = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";
  const errorInputStyles = fieldError ? "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500" : ""; // Simplificado, el color del texto/placeholder puede manejarse globalmente o con :invalid
  const disabledInputStyles = props.disabled ? "cursor-not-allowed bg-gray-100 dark:bg-gray-600 opacity-50" : "";

  const baseLabelStyles = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
  const errorTextStyles = "mt-2 text-sm text-red-600 dark:text-red-500";

  // Determinar si el campo es requerido basado en las reglas de registro (si existen)
  // Esto es una aproximación, las reglas pueden ser más complejas.
  // const isRequired = !!register(name).required; // No podemos llamar a register aquí directamente así

  return (
    <div className={cn("mb-4", containerClassName)}>
      {label && (
        <label htmlFor={props.id || name} className={cn(baseLabelStyles, labelClassName)}>
          {label}
          {/* Podríamos inferir 'required' de las reglas de validación, pero es complejo.
              Por ahora, podemos pasarlo como prop si es necesario mostrar el asterisco. */}
          {required && <span className="text-red-500 ms-1">*</span>}
        </label>
      )}
      <input
        id={props.id || name} // Usar name como fallback para id si no se provee
        type={type}
        className={cn(
          baseInputStyles,
          errorInputStyles,
          disabledInputStyles,
          className // Clases pasadas como prop
        )}
        // Registrar el input con react-hook-form
        // Se pueden pasar reglas de validación aquí: { required: 'Este campo es obligatorio' }
        {...register(name, { required: required ? `${label || name} es requerido` : false })}
        aria-invalid={fieldError ? 'true' : 'false'}
        aria-describedby={fieldError ? `${name}-error` : undefined}
        {...props} // Pasar el resto de las props (placeholder, disabled, etc.)
      />
      {fieldError && (
        <p id={`${name}-error`} className={cn(errorTextStyles)}>
          {fieldError}
        </p>
      )}
    </div>
  );
};

export default Input;

// Asegurar que es tratado como módulo
export {};
