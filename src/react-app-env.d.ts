/// <reference types="react-scripts" />

declare global {
  namespace NodeJS {
    interface Global {
      TextEncoder: typeof TextEncoder;
      TextDecoder: typeof TextDecoder;
      ReadableStream: typeof ReadableStream;
    }
  }
}

export {};
