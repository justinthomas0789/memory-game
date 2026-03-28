describe('test setup', () => {
  it('vitest and jsdom are configured correctly', () => {
    expect(typeof document).toBe('object');
    expect(true).toBe(true);
  });
});
