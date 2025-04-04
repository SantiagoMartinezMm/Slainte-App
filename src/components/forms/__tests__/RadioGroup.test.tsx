import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import RadioGroup from '../RadioGroup.tsx'; // Importar el componente React
import '@testing-library/jest-dom';

// Componente Wrapper
const TestForm: React.FC<{ children: React.ReactNode; defaultValues?: any }> = ({ children, defaultValues }) => {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}><form>{children}</form></FormProvider>;
};

const testOptions = [
  { value: 'radio1', label: 'Radio 1' },
  { value: 'radio2', label: 'Radio 2' },
  { value: 'radio3', label: 'Radio 3', disabled: true },
];

describe('RadioGroup Component (React)', () => {
  it('should render legend (if provided) and radio elements', () => {
    render(
      <TestForm>
        <RadioGroup name="testRadio" legend="Test Legend" options={testOptions} />
      </TestForm>
    );

    expect(screen.getByText('Test Legend')).toBeInTheDocument(); // Busca la leyenda
    expect(screen.getByLabelText('Radio 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Radio 2')).toBeInTheDocument();
    const radio3 = screen.getByLabelText('Radio 3') as HTMLInputElement;
    expect(radio3).toBeInTheDocument();
    expect(radio3.disabled).toBe(true); // Verificar opción deshabilitada
  });

   it('should render without legend if not provided', () => {
     render(
       <TestForm>
         <RadioGroup name="testRadio" options={testOptions} />
       </TestForm>
     );
     expect(screen.queryByRole('group')).not.toBeInTheDocument(); // No debe haber fieldset/legend
     expect(screen.getByLabelText('Radio 1')).toBeInTheDocument();
   });

  it('should register with react-hook-form and update selected value', () => {
    const Wrapper = () => {
      const methods = useForm({ defaultValues: { testRadio: '' } });
      return (
        <FormProvider {...methods}>
          <form>
            <RadioGroup name="testRadio" legend="Test Radio" options={testOptions} />
          </form>
        </FormProvider>
      );
    };

    render(<Wrapper />);
    const radio1 = screen.getByLabelText('Radio 1') as HTMLInputElement;
    const radio2 = screen.getByLabelText('Radio 2') as HTMLInputElement;

    expect(radio1.checked).toBe(false);
    expect(radio2.checked).toBe(false);

    fireEvent.click(radio2);
    expect(radio1.checked).toBe(false);
    expect(radio2.checked).toBe(true);

    fireEvent.click(radio1);
    expect(radio1.checked).toBe(true);
    expect(radio2.checked).toBe(false);
  });

  it('should display error message when validation fails', async () => {
     const Wrapper = () => {
       const methods = useForm<{ testRadio: string }>();
       React.useEffect(() => {
         methods.setError('testRadio', { type: 'manual', message: 'Debe seleccionar una opción de radio' });
       }, [methods]);

       return (
         <FormProvider {...methods}>
           <form>
             <RadioGroup name="testRadio" legend="Test Radio" options={testOptions} required />
           </form>
         </FormProvider>
       );
     };

     render(<Wrapper />);
     const errorMessage = await screen.findByText('Debe seleccionar una opción de radio');
     expect(errorMessage).toBeInTheDocument();

     // Verificar aria-invalid en el fieldset (role="group") ya que se proveyó legend
     const groupElement = screen.getByRole('group');
     expect(groupElement).toHaveAttribute('aria-invalid', 'true');
     expect(groupElement).toHaveAttribute('aria-describedby', 'testRadio-error');
   });

   it('should show required indicator if required prop is true', () => {
    render(
      <TestForm>
        <RadioGroup name="testRadio" legend="Required Radio" options={testOptions} required />
      </TestForm>
    );
    const legend = screen.getByText('Required Radio');
    expect(legend.querySelector('span.text-red-500')).toHaveTextContent('*');
   });

});
