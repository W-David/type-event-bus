# type-event-bus

> [English](README.md) | [简体中文](README_zh.md)

A lightweight, type-safe event bus library for TypeScript, leveraging ES6 Proxy for dynamic event management with complete type checking.

## Features

- **Complete Type Safety**: Full TypeScript integration with compile-time type checking for event names and payloads
- **Dynamic Event Creation**: Events are created on-the-fly via ES6 Proxy
- **Flexible Event Management**: Support for regular listeners, one-time listeners, and batch removal
- **Error Isolation**: Individual listener errors don't affect others
- **Modern JavaScript**: Built with modern TypeScript features and patterns

## Installation

```bash
npm install type-event-bus
# or
yarn add type-event-bus
# or
pnpm add type-event-bus
```

## Usage

### Basic Usage

```typescript
import { createTypedEvent } from 'type-event-bus'

// Define your events interface
type MyEvents = {
  click: [string]
  update: ['ui' | 'server', string]
  upload: [{ name: string; size: number }]
}

// Create your event bus instance
const eventBus = createTypedEvent<MyEvents>()

// Register listeners
eventBus.click.on(value => console.log(`Clicked: ${value}`))
eventBus.update.on((type, data) => console.log(`Updated ${type} with: ${data}`))

// Emit events
eventBus.click.emit('test')
eventBus.update.emit('ui', 'new data')
eventBus.upload.emit({ name: 'file.txt', size: 1024 })

// Remove specific listener
const myListener = (value: string) => console.log(value)
eventBus.click.on(myListener)
eventBus.click.off(myListener)

// Remove all listeners for an event
eventBus.click.offAll()

// One-time listener (will be removed after first execution)
eventBus.click.once(value => console.log(`Will only log once: ${value}`))
```

## API Reference

### `createTypedEvent<E extends Events>()`

Creates a new typed event bus instance with events defined in the provided type.

### EventEmitter Methods

#### `on(fn: Fn<T>)`

Registers a new listener function for the event.

#### `once(fn: Fn<T>)`

Registers a listener that will be invoked only once, then automatically removed.

#### `emit(...p: T)`

Emits the event with the provided arguments, triggering all registered listeners.

#### `off(fn?: Fn<T>)`

Removes a specific listener. If no listener is provided, removes all listeners for this event.

#### `offAll()`

Removes all listeners for the event.

## License

MIT
