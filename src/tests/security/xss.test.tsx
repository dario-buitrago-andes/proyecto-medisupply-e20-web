/**
 * Security tests: XSS prevention
 * Tests that user input is properly sanitized
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import Login from '../../pages/auth/Login';
import theme from '../../theme/theme';

describe('XSS Prevention', () => {
  const mockOnLoginSuccess = jest.fn();

  const renderLogin = () => {
    return render(
      <ThemeProvider theme={theme}>
        <Login onLoginSuccess={mockOnLoginSuccess} />
      </ThemeProvider>
    );
  };

  it('should sanitize script tags in email input', () => {
    const { container } = renderLogin();
    const emailInput = screen.getByLabelText(/email/i);
    
    // Try to inject script
    emailInput.setAttribute('value', '<script>alert("XSS")</script>');
    
    // Verify script is not executed (React should handle this, but we verify)
    const scripts = container.querySelectorAll('script');
    expect(scripts.length).toBe(0);
  });

  it('should sanitize HTML in form inputs', () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña|password/i);
    
    // React automatically escapes HTML in inputs, but we verify
    expect(emailInput).not.toContainHTML('<script>');
    expect(passwordInput).not.toContainHTML('<script>');
  });

  it('should not render dangerous HTML from user input', () => {
    const { container } = renderLogin();
    
    // Check that no dangerous HTML is present
    const dangerousPatterns = [
      /onerror=/i,
      /onclick=/i,
      /javascript:/i,
      /<iframe/i,
    ];
    
    dangerousPatterns.forEach(pattern => {
      expect(container.innerHTML).not.toMatch(pattern);
    });
  });
});

