import { describe, it, expect, beforeEach } from 'vitest'
import { TreeStore } from '../stores/treeStore'

describe('TreeStore', () => {
  const items = [
    { id: 1, parent: null, label: 'Айтем 1' },
    { id: 'child1', parent: 1, label: 'Айтем 2' },
    { id: 3, parent: 1, label: 'Айтем 3' },
    { id: 4, parent: 'child1', label: 'Айтем 4' },
    { id: 5, parent: 'child1', label: 'Айтем 5' },
    { id: 6, parent: 'child1', label: 'Айтем 6' },
    { id: 7, parent: 4, label: 'Айтем 7' },
    { id: 8, parent: 4, label: 'Айтем 8' },
  ]

  let treeStore: TreeStore

  beforeEach(() => {
    treeStore = new TreeStore(items)
  })

  describe('getAll', () => {
    it('should return all items', () => {
      expect(treeStore.getAll()).toEqual(items)
    })
  })

  describe('getItem', () => {
    it('should return item by id', () => {
      expect(treeStore.getItem(1)).toEqual(items[0])
      expect(treeStore.getItem('child1')).toEqual(items[1])
    })

    it('should return undefined for non-existent id', () => {
      expect(treeStore.getItem(999)).toBeUndefined()
    })
  })

  describe('getChildren', () => {
    it('should return direct children', () => {
      expect(treeStore.getChildren(1)).toEqual([items[1], items[2]])
      expect(treeStore.getChildren('child1')).toEqual([items[3], items[4], items[5]])
    })

    it('should return empty array for item without children', () => {
      expect(treeStore.getChildren(3)).toEqual([])
    })
  })

  describe('getAllChildren', () => {
    it('should return all childrens of first item', () => {
      const result = treeStore.getAllChildren(1)
      
      expect(result).toHaveLength(7)
      expect(result).toContainEqual(items[1])
      expect(result).toContainEqual(items[3])
      expect(result).toContainEqual(items[7])
    })

    it('should return empty array for item without children', () => {
      expect(treeStore.getAllChildren(3)).toEqual([])
    })
  })

  describe('getAllParents', () => {
    it('should return parent chain', () => {
      expect(treeStore.getAllParents(7)).toEqual([items[6], items[3], items[1], items[0]])
      expect(treeStore.getAllParents(1)).toEqual([items[0]])
    })

    it('should return empty array for root item', () => {
      expect(treeStore.getAllParents(1)).toEqual([items[0]])
    })
  })

  describe('addItem', () => {
    it('should add new item', () => {
      const newItem = { id: 9, parent: 1, label: 'Новый айтем' }
      treeStore.addItem(newItem)
      expect(treeStore.getItem(9)).toEqual(newItem)
      expect(treeStore.getChildren(1)).toContainEqual(newItem)
    })

    it('should throw error when adding item with existing id', () => {
      expect(() => {
        treeStore.addItem({ id: 1, parent: null, label: 'Дубликат' })
      }).toThrowError()
    })
  })

  describe('removeItem', () => {
    it('should remove item and its children', () => {
      treeStore.removeItem('child1')
      expect(treeStore.getItem('child1')).toBeUndefined()
      expect(treeStore.getItem(4)).toBeUndefined()
      expect(treeStore.getItem(7)).toBeUndefined()
      expect(treeStore.getChildren(1)).toEqual([items[2]])
    })

    it('should not throw when removing non-existent item', () => {
      expect(() => treeStore.removeItem(999)).not.toThrow()
    })
  })

  describe('updateItem', () => {
    it('should update item properties', () => {
      const updatedItem = { id: 1, parent: null, label: 'Обновленный' }
      treeStore.updateItem(updatedItem)
      expect(treeStore.getItem(1)).toEqual(updatedItem)
    })

    it('should handle parent change', () => {
      treeStore.updateItem({ id: 3, parent: 'child1', label: 'Айтем 3' })

      expect(treeStore.getChildren(1)).not.toContainEqual(items[2])
      expect(treeStore.getChildren('child1')).toContainEqual(items[2])
    })

    it('should throw when updating non-existent item', () => {
      expect(() => {
        treeStore.updateItem({ id: 999, parent: null, label: 'Несуществующий' })
      }).toThrowError()
    })
  })
})
