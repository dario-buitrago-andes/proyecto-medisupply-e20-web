// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import { toHaveNoViolations } from 'jest-axe';
import * as axe from '@axe-core/react';

// Polyfills for MSW in Node.js environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Polyfill for BroadcastChannel (required for MSW v2)
if (typeof global.BroadcastChannel === 'undefined') {
  global.BroadcastChannel = class BroadcastChannel {
    name: string;
    onmessage: ((event: MessageEvent) => void) | null = null;
    onmessageerror: ((event: MessageEvent) => void) | null = null;

    constructor(name: string) {
      this.name = name;
    }

    postMessage(_message: any): void {
      // No-op in test environment
    }

    close(): void {
      // No-op in test environment
    }

    addEventListener(_type: string, _listener: EventListener): void {
      // No-op in test environment
    }

    removeEventListener(_type: string, _listener: EventListener): void {
      // No-op in test environment
    }

    dispatchEvent(_event: Event): boolean {
      return false;
    }
  } as any;
}

// Polyfill for TransformStream (required for MSW v2)
// MSW v2 requires TransformStream which is available in Node 18+ natively
// For older Node versions or Jest environment, use polyfill
if (typeof global.TransformStream === 'undefined') {
  try {
    // Try native first (Node 18+)
    const streamWeb = require('stream/web');
    if (streamWeb && streamWeb.TransformStream) {
      global.TransformStream = streamWeb.TransformStream;
      global.ReadableStream = streamWeb.ReadableStream || global.ReadableStream;
      global.WritableStream = streamWeb.WritableStream || global.WritableStream;
    }
  } catch (e) {
    // Fallback to polyfill
    try {
      const { TransformStream, ReadableStream, WritableStream } = require('web-streams-polyfill/ponyfill');
      global.TransformStream = TransformStream;
      if (!global.ReadableStream) global.ReadableStream = ReadableStream;
      if (!global.WritableStream) global.WritableStream = WritableStream;
    } catch (e2) {
      // Last resort: create a minimal polyfill
      console.warn('TransformStream polyfill not available. Some MSW features may not work.');
    }
  }
}

expect.extend(toHaveNoViolations);

// Configure axe for React Testing Library
if (typeof window !== 'undefined') {
  axe.default(React, ReactDOM, 1000);
}
