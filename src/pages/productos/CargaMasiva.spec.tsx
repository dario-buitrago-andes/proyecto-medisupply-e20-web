import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CargaMasiva from './CargaMasiva';
import { ProductoService } from '../../services/productosService';

// Mock del servicio de productos
jest.mock('../../services/productosService', () => ({
  ProductoService: {
    cargaMasiva: jest.fn().mockResolvedValue({}),
  },
}));

// Mock de la función alert
const mockAlert = jest.fn();
global.alert = mockAlert;

describe('CargaMasiva', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    jest.clearAllMocks();
  });

  test('debe renderizar el componente de carga masiva correctamente', () => {
    render(<CargaMasiva />);
    
    // Verificar que se renderizan los elementos principales
    expect(screen.getByRole('button', { name: /Subir archivo/i })).toBeInTheDocument();
    // Verificar que hay un input de tipo file
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  test('debe permitir seleccionar un archivo', async () => {
    render(<CargaMasiva />);
    
    const file = new File(['contenido de prueba'], 'test.csv', { type: 'text/csv' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simular la selección de un archivo
    await userEvent.upload(fileInput, file);
    
    // Verificar que el archivo se ha seleccionado
    expect(fileInput.files?.length).toBe(1);
    expect(fileInput.files?.[0]).toBe(file);
  });

  test('debe llamar al servicio cuando se hace clic en el botón con un archivo seleccionado', async () => {
    render(<CargaMasiva />);
    
    // Crear un archivo de prueba
    const file = new File(['contenido de prueba'], 'test.csv', { type: 'text/csv' });
    
    // Simular la selección del archivo
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(fileInput, file);
    
    // Hacer clic en el botón de subida
    fireEvent.click(screen.getByRole('button', { name: /Subir archivo/i }));
    
    // Verificar que se llamó al servicio con el archivo correcto
    await waitFor(() => {
      expect(ProductoService.cargaMasiva).toHaveBeenCalledWith(file);
    });
    
    // Verificar que se mostró la alerta de éxito
    expect(mockAlert).toHaveBeenCalledWith('Carga masiva procesada');
  });

  test('no debe llamar al servicio cuando se hace clic en el botón sin archivo seleccionado', async () => {
    render(<CargaMasiva />);
    
    // Hacer clic en el botón sin seleccionar un archivo
    fireEvent.click(screen.getByRole('button', { name: /Subir archivo/i }));
    
    // Verificar que no se llamó al servicio
    expect(ProductoService.cargaMasiva).not.toHaveBeenCalled();
    
    // Verificar que no se mostró alerta
    expect(mockAlert).not.toHaveBeenCalled();
  });

  test('debe aceptar solo archivos CSV', () => {
    render(<CargaMasiva />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).toHaveAttribute('accept', '.csv');
  });

  test('debe manejar errores del servicio al subir archivos', async () => {
    // Configurar el mock para que rechace la promesa
    (ProductoService.cargaMasiva as jest.Mock).mockRejectedValueOnce(new Error('Error de servicio'));
    
    render(<CargaMasiva />);
    
    // Crear un archivo de prueba y seleccionarlo
    const file = new File(['contenido de prueba'], 'test.csv', { type: 'text/csv' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(fileInput, file);
    
    // Intentar subir el archivo
    fireEvent.click(screen.getByRole('button', { name: /Subir archivo/i }));
    
    // Verificar que se llamó al servicio
    await waitFor(() => {
      expect(ProductoService.cargaMasiva).toHaveBeenCalledWith(file);
    });
    
    // Verificar que se manejó el error (no se muestra alerta de éxito)
    expect(mockAlert).not.toHaveBeenCalled();
  });
});
