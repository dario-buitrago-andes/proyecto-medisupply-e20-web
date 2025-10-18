describe('MediSupply App', () => {
  it('debe tener un entorno de testing configurado correctamente', () => {
    expect(true).toBe(true);
  });

  it('debe tener acceso a las utilidades de testing', () => {
    expect(expect).toBeDefined();
    expect(describe).toBeDefined();
    expect(it).toBeDefined();
  });
});

export {};
