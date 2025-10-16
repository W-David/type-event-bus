// 事件函数的参数列表定义
type Params = unknown[]
// 事件函数定义
type Fn<T extends Params> = (...p: T) => void

// 描述触发的事件函数，触发的事件函数参数
type Events = {
  [K in string]: unknown[]
}

// 类型化的事件总线
type EventBus<E extends Events> = {
  readonly [K in keyof E]: EventEmitter<E[K]>
}

// 事件总线
class EventEmitter<T extends Params> {
  #callbacks: Array<{
    fn: Fn<T>
    once: boolean
  }>

  constructor() {
    this.#callbacks = []
  }

  on(fn: Fn<T>) {
    this.#callbacks.push({ fn, once: false })
  }
  once(fn: Fn<T>) {
    this.#callbacks.push({ fn, once: true })
  }
  emit(...p: T) {
    // 使用快照，防止 emit 期间被修改影响当前回调处理
    const callbacks = this.#callbacks.slice()
    for (const callback of callbacks) {
      try {
        callback.fn(...p)
      } catch (error) {
        // 错误异步抛出不打断其他回调
        setTimeout(() => {
          throw error
        })
      }
    }
    this.#callbacks = this.#callbacks.filter(callback => !callback.once)
  }

  off(fn?: Fn<T>) {
    if (!fn) {
      this.offAll()
      return
    }
    this.#callbacks = this.#callbacks.filter(callback => callback.fn !== fn)
  }
  offAll() {
    this.#callbacks = []
  }
}

function getProxy<T extends Params>(target: any, key: string, receiver?: unknown): EventEmitter<T> {
  if (typeof key === 'symbol') {
    return Reflect.get(target, key, receiver)
  }
  if (!(key in target)) {
    target[key] = new EventEmitter()
  }
  return target[key]
}

// 通过 ES6 proxy 劫持一个空对象的 get 实现事件挂接到这个对象的属性上
function createTypedEvent<E extends Events>() {
  return new Proxy({} as EventBus<E>, {
    get: getProxy,
    set: () => false,
    deleteProperty: () => false
  })
}

export type { Events }

export { createTypedEvent }
