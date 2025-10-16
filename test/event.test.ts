import { beforeEach, describe, expect, it } from '@jest/globals'
import type { Events } from '../src/eventbus'
import { createTypedEvent } from '../src/eventbus'

interface EventsType extends Events {
  click: [string]
  update: ['ui' | 'server', string]
  upload: [file: { name: string; size: number }]
}

describe('TypedEvent Tests', () => {
  let testBus: ReturnType<typeof createTypedEvent<EventsType>>

  beforeEach(() => {
    testBus = createTypedEvent<EventsType>()
  })

  // 测试基本的注册和触发功能
  it('should register and emit events', () => {
    let v1 = ''
    let v2 = ''
    let v3 = ''
    let v4 = {} as { name: string; size: number }
    testBus.click.on(v => (v1 = v))
    testBus.update.on((type, data) => {
      v2 = type
      v3 = data
    })
    testBus.upload.on(file => (v4 = file))

    testBus.click.emit('test')
    testBus.update.emit('ui', 'test')
    testBus.upload.emit({ name: 'json', size: 100 })

    expect(v1).toBe('test')
    expect(v2).toBe('ui')
    expect(v3).toBe('test')
    expect(v4.name).toBe('json')
    expect(v4.size).toBe(100)
  })

  // 测试once方法 - 只触发一次
  it('should only execute once callback once', () => {
    let count = 0
    testBus.click.once(() => {
      count++
    })

    testBus.click.emit('first')
    testBus.click.emit('second') // 这次不会触发回调

    expect(count).toBe(1)
  })

  // 测试off方法 - 移除监听器
  it('should remove listener with off method', () => {
    let count = 0
    const callback = () => {
      count++
    }
    testBus.click.on(callback)

    testBus.click.emit('first')
    expect(count).toBe(1)

    testBus.click.off(callback)
    testBus.click.emit('second') // 这次不会触发回调

    expect(count).toBe(1)
  })

  // 测试offAll方法 - 移除所有监听器
  it('should remove all listeners with offAll method', () => {
    let count1 = 0
    let count2 = 0
    const callback1 = () => {
      count1++
    }
    const callback2 = () => {
      count2++
    }
    testBus.click.on(callback1)
    testBus.click.on(callback2)

    testBus.click.emit('first')
    expect(count1).toBe(1)
    expect(count2).toBe(1)

    testBus.click.offAll()
    testBus.click.emit('second') // 这次不会触发任何回调

    expect(count1).toBe(1)
    expect(count2).toBe(1)
  })

  // 测试多个监听器
  it('should handle multiple listeners for the same event', () => {
    let values: string[] = []
    testBus.click.on(value => values.push(value + '-1'))
    testBus.click.on(value => values.push(value + '-2'))

    testBus.click.emit('test')

    expect(values).toEqual(['test-1', 'test-2'])
  })

  // 测试once和on方法共存
  it('should handle both once and on listeners correctly', () => {
    let onCount = 0
    let onceCount = 0

    testBus.click.on(() => onCount++)
    testBus.click.once(() => onceCount++)

    testBus.click.emit('first')
    expect(onCount).toBe(1)
    expect(onceCount).toBe(1)

    testBus.click.emit('second')
    expect(onCount).toBe(2)
    expect(onceCount).toBe(1) // once listener should have been removed
  })

  // 测试事件参数传递
  it('should correctly pass multiple parameters to listeners', () => {
    let receivedType: string | null = null
    let receivedData: string | null = null

    testBus.update.on((type, data) => {
      receivedType = type
      receivedData = data
    })

    testBus.update.emit('server', 'test-data')

    expect(receivedType).toBe('server')
    expect(receivedData).toBe('test-data')
  })

  // 测试对象参数传递
  it('should correctly pass object parameters to listeners', () => {
    let receivedFile: { name: string; size: number } | null = null

    testBus.upload.on(file => {
      receivedFile = file
    })

    const file = { name: 'test.txt', size: 200 }
    testBus.upload.emit(file)

    expect(receivedFile).toEqual(file)
  })
})
