import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import Input from '../Input.tsx'; // Importar el componente React
import '@testing-library/jest-dom'; // Para matchers como toBeInTheDocument

// Componente Wrapper para proveer el contexto de react-hook-form
const TestForm: React.FC<{ children: React.ReactNode; defaultValues?: any }> = ({ children, defaultValues }) => {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}><form>{children}</form></FormProvider>;
};

describe('Input Component (React)', () => {
  it('should render label and input element', () => {
    render(
      <TestForm>
        <Input name="testInput" label="Test Label" />
      </TestForm>
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Test Label/i })).toBeInTheDocument();
  });

  it('should register with react-hook-form and update value', () => {
    const Wrapper = () => {
      const methods = useForm({ defaultValues: { testInput: '' } });
      return (
        <FormProvider {...methods}>
          <form>
            <Input name="testInput" label="Test Input" />
          </form>
        </FormProvider>
      );
    };

    render(<Wrapper />);
    const inputElement = screen.getByLabelText('Test Input') as HTMLInputElement;

    fireEvent.change(inputElement, { target: { value: 'new value' } });
    expect(inputElement.value).toBe('new value');
  });

  it('should display error message when validation fails', async () => {
     const Wrapper = () => {
       const methods = useForm<{ testInput: string }>();
       const onSubmit = () => {}; // No necesitamos el submit real aquí

       // Simular un error manualmente para este test
       React.useEffect(() => {
         methods.setError('testInput', { type: 'manual', message: 'Este campo es inválido' });
       }, [methods]);

       return (
         <FormProvider {...methods}>
           <form onSubmit={methods.handleSubmit(onSubmit)}>
             <Input name="testInput" label="Test Input" required />
             {/* <button type="submit">Submit</button> */}
           </form>
         </FormProvider>
       );
     };

     render(<Wrapper />);

     // Esperar a que aparezca el mensaje de error
     // Usar findByText que espera a que el elemento aparezca
     const errorMessage = await screen.findByText('Este campo es inválido');
     expect(errorMessage).toBeInTheDocument();

     // Verificar atributos aria
     const inputElement = screen.getByLabelText(/Test Input/i);
     expect(inputElement).toHaveAttribute('aria-invalid', 'true');
     expect(inputElement).toHaveAttribute('aria-describedby', 'testInput-error');
   });

   it('should show required indicator if required prop is true', () => {
    render(
      <TestForm>
        <Input name="testInput" label="Required Label" required />
      </TestForm>
    );
    // Buscar el asterisco dentro de la etiqueta
    const label = screen.getByText('Required Label');
    expect(label.querySelector('span.text-red-500')).toHaveTextContent('*');
   });

});
