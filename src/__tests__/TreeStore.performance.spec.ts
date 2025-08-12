import { describe, it, expect, beforeEach } from 'vitest'
import { TreeStore } from '../stores/treeStore'
import type { Item } from '../types/tree'

const generateTestData = (count: number): Item[] => {
  const items: Item[] = [{ id: 0, parent: null, label: 'Root' }]

  for (let i = 1; i < count; i++) {
    const parent = Math.floor(Math.random() * i)
    items.push({
      id: i,
      parent: items[parent].id,
      label: `Item ${i}`
    })
  }

  return items
}

describe('TreeStore Performance', () => {
  const TEST_SIZES = [100, 1000, 5000, 10000]
  let testStores: Map<number, TreeStore>

  beforeEach(() => {
    testStores = new Map()
    TEST_SIZES.forEach((size) => {
      testStores.set(size, new TreeStore(generateTestData(size)))
    })
  })

  TEST_SIZES.forEach((size) => {
    it(`initializes ${size} items quickly`, () => {
      const data = generateTestData(size)
      const start = performance.now()
      new TreeStore(data)
      const duration = performance.now() - start

      console.log(`Init ${size} items: ${duration.toFixed(2)}ms`)
      expect(duration).toBeLessThan(size * 0.1)
    })
  })

  describe('getItem performance', () => {
    TEST_SIZES.forEach((size) => {
      it(`getItem with ${size} items`, () => {
        const store = testStores.get(size)!
        const randomId = Math.floor(Math.random() * size)

        const start = performance.now()
        const item = store.getItem(randomId)
        const duration = performance.now() - start

        expect(item).toBeDefined()
        console.log(`getItem(${size}): ${duration.toFixed(2)}ms`)
        expect(duration).toBeLessThan(1)
      })
    })
  })

  describe('getChildren performance', () => {
    TEST_SIZES.forEach((size) => {
      it(`getChildren with ${size} items`, () => {
        const store = testStores.get(size)!
        const midItemId = Math.floor(size / 2)

        const start = performance.now()
        const children = store.getChildren(midItemId)
        const duration = performance.now() - start

        console.log(`getChildren(${size}): ${duration.toFixed(2)}ms`)
        expect(duration).toBeLessThan(2)
      })
    })
  })

  describe('deep nesting performance', () => {
    it('handles deep hierarchies', () => {

      const deepItems: Item[] = [{ id: 0, parent: null, label: 'Root' }]
      for (let i = 1; i <= 100; i++) {
        deepItems.push({ id: i, parent: i - 1, label: `Level ${i}` })
      }

      const store = new TreeStore(deepItems)
      const start = performance.now()
      const allParents = store.getAllParents(100)
      const duration = performance.now() - start

      expect(allParents.length).toBe(101)
      console.log(`Deep nesting (100 levels): ${duration.toFixed(2)}ms`)
      expect(duration).toBeLessThan(5)
    })
  })

  describe('bulk operations', () => {
    it('adds 1000 items quickly', () => {
      const store = testStores.get(1000)!
      const newItems = Array.from({ length: 1000 }, (_, i) => ({
        id: 1000 + i,
        parent: Math.floor(Math.random() * 1000),
        label: `New Item ${i}`
      }))

      const start = performance.now()
      newItems.forEach((item) => store.addItem(item))
      const duration = performance.now() - start

      console.log(`Add 1000 items: ${duration.toFixed(2)}ms`)
      expect(duration).toBeLessThan(50)
      expect(store.getAll().length).toBe(2000)
    })
  })
})
