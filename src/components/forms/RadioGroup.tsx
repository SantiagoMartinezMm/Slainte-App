import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils'; // Asumiendo que cn está configurado

// Tipo para las opciones de radio (puede compartirse)
interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  id?: string;
}

// Props para el componente RadioGroup de React
// Cambiado HTMLDivElement a HTMLElement para compatibilidad con fieldset y div
interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  legend?: string;
  name: string; // Obligatorio para react-hook-form
  options: RadioOption[];
  required?: boolean;
  disabled?: boolean; // Deshabilitar todo el grupo
  groupClassName?: string; // Clases para fieldset/div
  radioContainerClassName?: string; // Clases para el div de cada radio+label
  inputClassName?: string; // Clases para el input radio
  labelClassName?: string; // Clases para la etiqueta del radio
  // 'selectedValue' y 'error' se obtienen del contexto/RHF
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  legend,
  name,
  options = [],
  required,
  disabled = false, // Deshabilitar grupo entero
  groupClassName,
  radioContainerClassName = "flex items-center mb-2", // Clase por defecto
  inputClassName,
  labelClassName,
  ...props // Resto de props van al fieldset/div
}) => {
  const { register, formState: { errors }, watch } = useFormContext();
  const fieldError = errors[name]?.message as string | undefined;

  // Observar el valor actual para marcar el 'checked' (opcional, RHF lo maneja internamente)
  // const selectedValue = watch(name);

  // Estilos (adaptados de RadioGroup.astro)
  const baseInputStyles = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600";
  const disabledInputStyles = (optionDisabled?: boolean) => (disabled || optionDisabled) ? "cursor-not-allowed opacity-50" : "";
  const baseLabelStyles = "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300";
  const disabledLabelStyles = (optionDisabled?: boolean) => (disabled || optionDisabled) ? "cursor-not-allowed opacity-50" : "";
  const legendStyles = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
  const errorTextStyles = "mt-2 text-sm text-red-600 dark:text-red-500";

  const renderOptions = () => options.map((option, index) => {
    const optionId = option.id ?? `${name}-${index}`;
    const isDisabled = disabled || option.disabled;
    return (
      <div key={optionId} className={cn(radioContainerClassName)}>
        <input
          type="radio"
          id={optionId}
          value={option.value}
          disabled={isDisabled}
          className={cn(
            baseInputStyles,
            disabledInputStyles(option.disabled),
            inputClassName
          )}
          // Registrar el radio button con react-hook-form
          {...register(name, { required: required ? `${legend || name} es requerido` : false })}
          // 'checked' es manejado por RHF basado en el valor del campo
          aria-invalid={fieldError ? 'true' : 'false'}
          // Solo el grupo necesita aria-describedby
        />
        <label
          htmlFor={optionId}
          className={cn(
            baseLabelStyles,
            disabledLabelStyles(option.disabled),
            labelClassName
          )}
        >
          {option.label}
        </label>
      </div>
    );
  });

  return (
    legend ? (
      <fieldset
        className={cn("mb-4", groupClassName)}
        aria-invalid={fieldError ? 'true' : 'false'}
        aria-describedby={fieldError ? `${name}-error` : undefined}
        disabled={disabled} // Deshabilitar fieldset afecta a hijos
        {...props}
      >
        <legend className={cn(legendStyles)}>
          {legend}
          {required && <span className="text-red-500 ms-1">*</span>}
        </legend>
        {renderOptions()}
        {fieldError && (
          <p id={`${name}-error`} className={cn(errorTextStyles)}>
            {fieldError}
          </p>
        )}
      </fieldset>
    ) : (
      <div
        className={cn("mb-4", groupClassName)}
        role="radiogroup"
        aria-invalid={fieldError ? 'true' : 'false'}
        aria-describedby={fieldError ? `${name}-error` : undefined}
        {...props}
      >
        {renderOptions()}
        {fieldError && (
          <p id={`${name}-error`} className={cn(errorTextStyles)}>
            {fieldError}
          </p>
        )}
      </div>
    )
  );
};

export default RadioGroup;

// Asegurar que es tratado como módulo
export {};
