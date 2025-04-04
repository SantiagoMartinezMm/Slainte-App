import React from 'react';
import { useForm, FormProvider, type SubmitHandler, type FieldValues } from 'react-hook-form';

interface FormHandlerProps<T extends FieldValues> {
  onSubmit: SubmitHandler<T>; // Función a ejecutar en el envío exitoso
  children: React.ReactNode; // Los campos del formulario
  // Podrían añadirse props para schema de validación (Zod), valores por defecto, etc.
  // validationSchema?: any;
  // defaultValues?: Partial<T>;
  id?: string; // Para asociar con el <form> si es necesario
}

const FormHandler = <T extends FieldValues>({
  onSubmit,
  children,
  id,
  // validationSchema,
  // defaultValues,
}: FormHandlerProps<T>) => {
  // Inicializar react-hook-form
  const methods = useForm<T>({
    // resolver: validationSchema ? zodResolver(validationSchema) : undefined, // Ejemplo con Zod
    // defaultValues: defaultValues,
  });

  // La etiqueta <form> real estará en Form.astro. Aquí usamos FormProvider
  // para pasar el contexto de react-hook-form a los campos hijos.
  // El onSubmit del <form> en Astro deberá llamar a methods.handleSubmit(onSubmit)
  // Esto requiere pasar 'methods' o 'handleSubmit' de alguna manera a Form.astro,
  // o refactorizar Form.astro para que sea más un simple contenedor.

  // Por ahora, este componente solo provee el contexto.
  // La integración con el <form> de Astro necesita refinamiento.
  // Una alternativa es que este componente RENDERICE el <form> directamente.

  // Alternativa: Renderizar el form aquí
  const handleFormSubmit = methods.handleSubmit(onSubmit);

  return (
    <FormProvider {...methods}>
      {/* Renderizamos los hijos directamente. Asumimos que los hijos son
          componentes React o componentes Astro adaptados que pueden usar
          el contexto de react-hook-form (useFormContext). */}
      {children}
      {/* Necesitamos una forma de conectar el botón de submit del formulario
          renderizado por Astro con handleFormSubmit. Esto es complejo.

          Quizás sea mejor que Form.astro simplemente renderice este componente
          y este componente renderice la etiqueta <form> y los children.
          Vamos a probar ese enfoque. */}
    </FormProvider>
  );
};

// --- Enfoque Alternativo: FormHandler renderiza el <form> ---

// Omitimos 'onSubmit' de los atributos HTML estándar para evitar conflicto de tipos
interface FormWrapperProps<T extends FieldValues> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  // validationSchema?: any;
  // defaultValues?: Partial<T>;
  // Usar MutableRefObject para poder asignar a .current
  formMethodsRef?: React.MutableRefObject<ReturnType<typeof useForm<T>> | null>; // Para exponer métodos si es necesario
}

const FormWrapper = <T extends FieldValues>({
  onSubmit,
  children,
  // validationSchema,
  // defaultValues,
  formMethodsRef,
  ...formProps // Resto de props para la etiqueta <form> (className, etc.)
}: FormWrapperProps<T>) => {
  const methods = useForm<T>({
     // resolver: validationSchema ? zodResolver(validationSchema) : undefined,
     // defaultValues: defaultValues,
  });

  // Si se proporciona una ref mutable, asignamos los métodos a ella
  if (formMethodsRef) {
     formMethodsRef.current = methods;
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate // Deshabilitar validación HTML nativa
        {...formProps} // Aplicar className, etc.
      >
        {children}
      </form>
    </FormProvider>
  );
};


// Exportamos el segundo enfoque (FormWrapper) que parece más práctico para Astro
export default FormWrapper;

// Asegurar que es tratado como módulo
export {};
