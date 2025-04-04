import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import Select from '../Select.tsx'; // Importar el componente React
import '@testing-library/jest-dom';

// Componente Wrapper para proveer el contexto de react-hook-form
const TestForm: React.FC<{ children: React.ReactNode; defaultValues?: any }> = ({ children, defaultValues }) => {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}><form>{children}</form></FormProvider>;
};

const testOptions = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3', disabled: true },
];

describe('Select Component (React)', () => {
  it('should render label, select element and options', () => {
    render(
      <TestForm>
        <Select name="testSelect" label="Test Select" options={testOptions} />
      </TestForm>
    );

    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
    const selectElement = screen.getByRole('combobox', { name: /Test Select/i });
    expect(selectElement).toBeInTheDocument();

    // Verificar opciones
    expect(screen.getByRole('option', { name: 'Option 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Option 2' })).toBeInTheDocument();
    const option3 = screen.getByRole('option', { name: 'Option 3' }) as HTMLOptionElement;
    expect(option3).toBeInTheDocument();
    expect(option3.disabled).toBe(true); // Verificar opción deshabilitada
  });

  it('should render placeholder option if provided and select it by default', () => {
    render(
      // Añadir defaultValue vacío para asegurar que el placeholder esté seleccionado
      <TestForm defaultValues={{ testSelect: '' }}>
        <Select name="testSelect" label="Test Select" options={testOptions} placeholder="-- Select --" />
      </TestForm>
    );
    const placeholderOption = screen.getByRole('option', { name: '-- Select --' }) as HTMLOptionElement;
    expect(placeholderOption).toBeInTheDocument();
    expect(placeholderOption.disabled).toBe(true);
    expect(placeholderOption.selected).toBe(true); // Placeholder debe estar seleccionado por defecto
  });

  it('should register with react-hook-form and update value', () => {
    const Wrapper = () => {
      const methods = useForm({ defaultValues: { testSelect: '' } });
      return (
        <FormProvider {...methods}>
          <form>
            <Select name="testSelect" label="Test Select" options={testOptions} placeholder="-- Select --" />
          </form>
        </FormProvider>
      );
    };

    render(<Wrapper />);
    const selectElement = screen.getByLabelText('Test Select') as HTMLSelectElement;

    fireEvent.change(selectElement, { target: { value: 'opt2' } });
    expect(selectElement.value).toBe('opt2');
  });

  it('should display error message when validation fails', async () => {
     const Wrapper = () => {
       const methods = useForm<{ testSelect: string }>();
       React.useEffect(() => {
         methods.setError('testSelect', { type: 'manual', message: 'Debe seleccionar una opción' });
       }, [methods]);

       return (
         <FormProvider {...methods}>
           <form>
             <Select name="testSelect" label="Test Select" options={testOptions} required />
           </form>
         </FormProvider>
       );
     };

     render(<Wrapper />);
     const errorMessage = await screen.findByText('Debe seleccionar una opción');
     expect(errorMessage).toBeInTheDocument();

     const selectElement = screen.getByLabelText(/Test Select/i);
     expect(selectElement).toHaveAttribute('aria-invalid', 'true');
     expect(selectElement).toHaveAttribute('aria-describedby', 'testSelect-error');
   });

   it('should show required indicator if required prop is true', () => {
    render(
      <TestForm>
        <Select name="testSelect" label="Required Select" options={testOptions} required />
      </TestForm>
    );
    const label = screen.getByText('Required Select');
    expect(label.querySelector('span.text-red-500')).toHaveTextContent('*');
   });

});
