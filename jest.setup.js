// Suppress unnecessary console logs during tests
global.console = {
    log: jest.fn(), // Hide console.log
    info: jest.fn(), // Hide console.info
    warn: console.warn, // Keep console.warn visible
    error: console.error, // Keep console.error visible for debugging
  };
  