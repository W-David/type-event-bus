# type-event-bus

> [English](README.md) | [简体中文](README_zh.md)

一个轻量级、类型安全的TypeScript事件总线库，利用ES6 Proxy实现动态事件管理和完整的类型检查。

## 特性

- **完整的类型安全**：与TypeScript完全集成，提供事件名称和负载的编译时类型检查
- **动态事件创建**：通过ES6 Proxy动态创建事件
- **灵活的事件管理**：支持常规监听器、一次性监听器和批量移除功能
- **错误隔离**：单个监听器的错误不会影响其他监听器的执行
- **现代JavaScript**：使用现代TypeScript特性和模式构建

## 安装

```bash
npm install type-event-bus
# 或
yarn add type-event-bus
# 或
pnpm add type-event-bus
```

## 使用方法

### 基本使用

```typescript
import { createTypedEvent } from 'type-event-bus'

// 定义事件接口
type MyEvents = {
  click: [string]
  update: ['ui' | 'server', string]
  upload: [{ name: string; size: number }]
}

// 创建事件总线实例
const eventBus = createTypedEvent<MyEvents>()

// 注册监听器
eventBus.click.on(value => console.log(`点击了: ${value}`))
eventBus.update.on((type, data) => console.log(`${type}更新了数据: ${data}`))

// 触发事件
eventBus.click.emit('test')
eventBus.update.emit('ui', '新数据')
eventBus.upload.emit({ name: '文件.txt', size: 1024 })

// 移除特定监听器
const myListener = (value: string) => console.log(value)
eventBus.click.on(myListener)
eventBus.click.off(myListener)

// 移除事件的所有监听器
eventBus.click.offAll()

// 一次性监听器（执行后自动移除）
eventBus.click.once(value => console.log(`只会记录一次: ${value}`))
```

## API参考

### `createTypedEvent<E extends Events>()`

创建一个新的类型化事件总线实例，其中包含在提供的类型中定义的事件。

### EventEmitter 方法

#### `on(fn: Fn<T>)`

为事件注册一个新的监听器函数。

#### `once(fn: Fn<T>)`

注册一个只执行一次的监听器，执行后自动移除。

#### `emit(...p: T)`

触发事件并提供参数，执行所有注册的监听器。

#### `off(fn?: Fn<T>)`

移除特定的监听器。如果未提供监听器，则移除该事件的所有监听器。

#### `offAll()`

移除事件的所有监听器。

## 许可证

MIT
