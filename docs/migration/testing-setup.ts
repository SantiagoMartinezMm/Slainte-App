import { expect, test } from 'vitest';
import { render } from '@testing-library/react';

// Configuración base para testing
const customRender = (ui: React.ReactElement, options = {}) => {
  return render(ui, {
    wrapper: ({ children }) => children,
    ...options,
  });
};

// Ejemplo de test
test('component renders correctly', () => {
  const { container } = customRender(<Component />);
  expect(container).toBeInTheDocument();
});