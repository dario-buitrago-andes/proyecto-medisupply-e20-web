import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlanVentaForm from './PlanVentaForm';
import { PlanVentaService } from '../../services/planesVentaService';

// Mock del servicio
jest.mock('../../services/planesVentaService', () => ({
  PlanVentaService: {
    crear: jest.fn().mockResolvedValue({}),
  },
}));

// Mock de la función alert
const mockAlert = jest.fn();
global.alert = mockAlert;

describe('PlanVentaForm', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    jest.clearAllMocks();
  });

  test('debe renderizar todos los campos del formulario', () => {
    render(<PlanVentaForm />);
    
    // Verificar que todos los campos estén presentes
    expect(screen.getByLabelText(/Vendedor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Periodo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Año/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/País/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Productos objetivo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Meta monetaria/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Guardar/i })).toBeInTheDocument();
  });

  test('debe mostrar las opciones correctas en los campos select', () => {
    render(<PlanVentaForm />);
    
    // Verificar opciones de Vendedor
    fireEvent.mouseDown(screen.getByLabelText(/Vendedor/i));
    expect(screen.getByText('James Rodriguez')).toBeInTheDocument();
    expect(screen.getByText('Luis Diaz')).toBeInTheDocument();
    expect(screen.getByText('David Ospina')).toBeInTheDocument();
    
    // Verificar opciones de Periodo
    fireEvent.mouseDown(screen.getByLabelText(/Periodo/i));
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
    expect(screen.getByText('Q3')).toBeInTheDocument();
    expect(screen.getByText('Q4')).toBeInTheDocument();
    
    // Verificar opciones de País
    fireEvent.mouseDown(screen.getByLabelText(/País/i));
    expect(screen.getByText('Colombia')).toBeInTheDocument();
    expect(screen.getByText('Perú')).toBeInTheDocument();
    expect(screen.getByText('Ecuador')).toBeInTheDocument();
    expect(screen.getByText('México')).toBeInTheDocument();
  });

  test('debe mostrar errores de validación cuando se envía el formulario vacío', async () => {
    render(<PlanVentaForm />);
    
    // Intentar enviar el formulario sin completar campos
    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }));

    // Verificar mensajes de error para campos requeridos
    expect(await screen.findByText(/El vendedor es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/El periodo es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/El país es obligatorio/i)).toBeInTheDocument();
    expect(await screen.findByText(/Debe seleccionar al menos un producto/i)).toBeInTheDocument();
  });

  test('debe validar el formato del año', async () => {
    render(<PlanVentaForm />);
    
    // Ingresar un año con formato incorrecto (menos de 4 dígitos)
    const añoInput = screen.getByLabelText(/Año/i);
    fireEvent.change(añoInput, { target: { value: '202' } });
    fireEvent.blur(añoInput);
    
    // Intentar enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }));

    // Verificar que aparezca el mensaje de error
    expect(await screen.findByText(/Debe tener 4 dígitos/i)).toBeInTheDocument();
  });

  test('debe permitir seleccionar múltiples productos', async () => {
    render(<PlanVentaForm />);
    
    // Abrir el selector de productos
    const productosSelect = screen.getByLabelText(/Productos objetivo/i);
    fireEvent.mouseDown(productosSelect);
    
    // Seleccionar dos productos
    const guantesOpcion = screen.getByText('Guantes quirúrgicos');
    const mascarillasOpcion = screen.getByText('Mascarillas N95');
    
    fireEvent.click(guantesOpcion);
    fireEvent.click(mascarillasOpcion);
    
    // Cerrar el selector
    fireEvent.mouseDown(productosSelect);
    
    // Volver a abrir para verificar selecciones
    fireEvent.mouseDown(productosSelect);
    
    // Verificar que los productos estén seleccionados (por los checkboxes marcados)
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  test('debe mostrar alerta cuando la meta monetaria es menor o igual a 0', async () => {
    render(<PlanVentaForm />);
    
    // Completar el formulario con datos válidos
    userEvent.selectOptions(screen.getByLabelText(/Vendedor/i), 'James Rodriguez');
    userEvent.selectOptions(screen.getByLabelText(/Periodo/i), 'Q1');
    fireEvent.change(screen.getByLabelText(/Año/i), { target: { value: '2025' } });
    userEvent.selectOptions(screen.getByLabelText(/País/i), 'Colombia');
    
    // Seleccionar un producto
    const productosSelect = screen.getByLabelText(/Productos objetivo/i);
    fireEvent.mouseDown(productosSelect);
    fireEvent.click(screen.getByText('Guantes quirúrgicos'));
    fireEvent.mouseDown(productosSelect);
    
    // Ingresar una meta monetaria inválida (0)
    fireEvent.change(screen.getByLabelText(/Meta monetaria/i), { target: { value: '0' } });
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }));
    
    // Verificar que se muestre la alerta
    expect(mockAlert).toHaveBeenCalledWith('La meta monetaria debe ser mayor a 0');
  });

  test('debe enviar el formulario correctamente con datos válidos', async () => {
    render(<PlanVentaForm />);
    
    // Completar el formulario con datos válidos
    userEvent.selectOptions(screen.getByLabelText(/Vendedor/i), 'James Rodriguez');
    userEvent.selectOptions(screen.getByLabelText(/Periodo/i), 'Q1');
    fireEvent.change(screen.getByLabelText(/Año/i), { target: { value: '2025' } });
    userEvent.selectOptions(screen.getByLabelText(/País/i), 'Colombia');
    
    // Seleccionar un producto
    const productosSelect = screen.getByLabelText(/Productos objetivo/i);
    fireEvent.mouseDown(productosSelect);
    fireEvent.click(screen.getByText('Guantes quirúrgicos'));
    fireEvent.mouseDown(productosSelect);
    
    // Ingresar una meta monetaria válida
    fireEvent.change(screen.getByLabelText(/Meta monetaria/i), { target: { value: '1000' } });
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }));
    
    // Verificar que se llamó al servicio con los datos correctos
    await waitFor(() => {
      expect(PlanVentaService.crear).toHaveBeenCalledWith({
        vendedor: 'James Rodriguez',
        periodo: 'Q1',
        anio: 2025,
        pais: 'Colombia',
        productos_objetivo: ['Guantes quirúrgicos'],
        meta_monetaria_usd: '1000.00'
      });
    });
    
    // Verificar mensaje de éxito
    expect(mockAlert).toHaveBeenCalledWith('✅ Plan de venta creado correctamente');
  });

  test('debe formatear correctamente la meta monetaria a 2 decimales', () => {
    render(<PlanVentaForm />);
    
    // Ingresar un valor en el campo de meta monetaria
    const metaInput = screen.getByLabelText(/Meta monetaria/i);
    fireEvent.change(metaInput, { target: { value: '1000.123' } });
    fireEvent.blur(metaInput);
    
    // Verificar que el valor se haya formateado a 2 decimales
    expect(metaInput).toHaveValue('1000.12');
  });

  test('debe manejar errores del servicio al crear el plan de venta', async () => {
    // Configurar mock para simular un error
    (PlanVentaService.crear as jest.Mock).mockRejectedValueOnce(new Error('Error de servicio'));
    
    render(<PlanVentaForm />);
    
    // Completar el formulario con datos válidos
    userEvent.selectOptions(screen.getByLabelText(/Vendedor/i), 'James Rodriguez');
    userEvent.selectOptions(screen.getByLabelText(/Periodo/i), 'Q1');
    fireEvent.change(screen.getByLabelText(/Año/i), { target: { value: '2025' } });
    userEvent.selectOptions(screen.getByLabelText(/País/i), 'Colombia');
    
    // Seleccionar un producto
    const productosSelect = screen.getByLabelText(/Productos objetivo/i);
    fireEvent.mouseDown(productosSelect);
    fireEvent.click(screen.getByText('Guantes quirúrgicos'));
    fireEvent.mouseDown(productosSelect);
    
    // Ingresar una meta monetaria válida
    fireEvent.change(screen.getByLabelText(/Meta monetaria/i), { target: { value: '1000' } });
    
    // Enviar el formulario
    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }));
    
    // Verificar que se llamó al servicio
    await waitFor(() => {
      expect(PlanVentaService.crear).toHaveBeenCalled();
    });
    
    // Verificar que no se muestre el mensaje de éxito
    expect(mockAlert).not.toHaveBeenCalledWith('✅ Plan de venta creado correctamente');
  });
});
