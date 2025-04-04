import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import Checkbox from '../Checkbox.tsx'; // Importar el componente React
import '@testing-library/jest-dom';

// Componente Wrapper
const TestForm: React.FC<{ children: React.ReactNode; defaultValues?: any }> = ({ children, defaultValues }) => {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}><form>{children}</form></FormProvider>;
};

describe('Checkbox Component (React)', () => {
  it('should render label and checkbox element', () => {
    render(
      <TestForm>
        <Checkbox name="testCheckbox" label="Test Checkbox" />
      </TestForm>
    );

    expect(screen.getByLabelText('Test Checkbox')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Test Checkbox/i })).toBeInTheDocument();
  });

  it('should register with react-hook-form and update checked state', () => {
    const Wrapper = () => {
      const methods = useForm({ defaultValues: { testCheckbox: false } });
      return (
        <FormProvider {...methods}>
          <form>
            <Checkbox name="testCheckbox" label="Test Checkbox" />
          </form>
        </FormProvider>
      );
    };

    render(<Wrapper />);
    const checkboxElement = screen.getByLabelText('Test Checkbox') as HTMLInputElement;

    expect(checkboxElement.checked).toBe(false);
    fireEvent.click(checkboxElement);
    expect(checkboxElement.checked).toBe(true);
    fireEvent.click(checkboxElement);
    expect(checkboxElement.checked).toBe(false);
  });

  it('should display error message (if applicable, less common for single checkbox)', async () => {
     const Wrapper = () => {
       const methods = useForm<{ testCheckbox: boolean }>();
       React.useEffect(() => {
         // Simular error (e.g., si el checkbox fuera requerido para aceptar términos)
         methods.setError('testCheckbox', { type: 'manual', message: 'Debe aceptar los términos' });
       }, [methods]);

       return (
         <FormProvider {...methods}>
           <form>
             <Checkbox name="testCheckbox" label="Test Checkbox" required />
           </form>
         </FormProvider>
       );
     };

     render(<Wrapper />);
     const errorMessage = await screen.findByText('Debe aceptar los términos');
     expect(errorMessage).toBeInTheDocument();

     const checkboxElement = screen.getByLabelText(/Test Checkbox/i);
     expect(checkboxElement).toHaveAttribute('aria-invalid', 'true');
     // Checkbox no suele tener aria-describedby para errores directamente en el input
   });

   it('should be disabled if disabled prop is true', () => {
    render(
      <TestForm>
        <Checkbox name="testCheckbox" label="Disabled Checkbox" disabled />
      </TestForm>
    );
    const checkboxElement = screen.getByLabelText('Disabled Checkbox') as HTMLInputElement;
    expect(checkboxElement.disabled).toBe(true);
   });

});
