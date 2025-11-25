declare module 'jest-axe' {
  import { ReactElement } from 'react';
  
  export interface AxeResults {
    violations: any[];
    passes: any[];
    incomplete: any[];
    inapplicable: any[];
  }
  
  export function axe(
    element: ReactElement | Element | Document,
    options?: any
  ): Promise<AxeResults>;
  
  export const toHaveNoViolations: jest.CustomMatcher;
}

