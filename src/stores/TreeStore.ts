import type { Item } from '../types/tree'

export class TreeStore {
  private items: Item[]
  private itemsMap: Map<number | string, Item>
  private childrenMap: Map<number | string, Item[]>

  constructor(items: Item[]) {
    this.items = [...items]
    this.itemsMap = new Map()
    this.childrenMap = new Map()

    items.forEach((item) => this.itemsMap.set(item.id, item))

    items.forEach((item) => {
      if (item.parent === null) {
        return
      }

      if (!this.childrenMap.has(item.parent)) {
        this.childrenMap.set(item.parent, [])
      }
      this.childrenMap.get(item.parent)!.push(item)
    })
  }

  getAll(): Item[] {
    return [...this.items]
  }

  getItem(id: number | string): Item | undefined {
    return this.itemsMap.get(id)
  }

  getChildren(id: number | string): Item[] {
    const children = this.childrenMap.get(id)

    if (!children) {
      return []
    } else {
      return [...children]
    }
  }

  getAllChildren(id: number | string): Item[] {
    const result: Item[] = []
    const stack: (number | string)[] = [id]

    while (stack.length > 0) {
      const currentId = stack.pop()!
      const children = this.getChildren(currentId)

      children.forEach((child) => {
        result.push(child)
        stack.push(child.id)
      })
    }

    return result
  }

  getAllParents(id: number | string): Item[] {
    const result: Item[] = []
    let currentId: number | string | null = id

    while (currentId !== null) {
      const item = this.getItem(currentId)
      if (!item) break

      result.push(item)
      currentId = item.parent
    }

    return result
  }

  addItem(item: Item): void {
    if (this.itemsMap.has(item.id)) {
      throw new Error(`Item with id ${item.id} already exists`)
    }

    this.items.push(item)
    this.itemsMap.set(item.id, item)

    if (item.parent === null) {
      return
    }

    if (!this.childrenMap.has(item.parent)) {
      this.childrenMap.set(item.parent, [])
    }
    this.childrenMap.get(item.parent)!.push(item)
  }

  removeItem(id: number | string): void {
    const itemToRemove = this.getItem(id)
    if (!itemToRemove) return

    const children = this.getAllChildren(id)
    children.forEach((child) => {
      this.items = this.items.filter((item) => item.id !== child.id)
      this.itemsMap.delete(child.id)
    })

    this.items = this.items.filter((item) => item.id !== id)
    this.itemsMap.delete(id)

    if (itemToRemove.parent === null) {
      return
    }

    const parentChildren = this.childrenMap.get(itemToRemove.parent)
    if (parentChildren) {
      this.childrenMap.set(
        itemToRemove.parent,
        parentChildren.filter((child) => child.id !== id),
      )
    }

    this.childrenMap.delete(id)
  }

  updateItem(updatedItem: Item): void {
    const existingItem = this.getItem(updatedItem.id)
    if (!existingItem) {
      throw new Error(`Item with id ${updatedItem.id} not found`)
    }

    if (existingItem.parent !== updatedItem.parent) {
      if (existingItem.parent !== null) {
        const oldParentChildren = this.childrenMap.get(existingItem.parent)
        if (oldParentChildren) {
          this.childrenMap.set(
            existingItem.parent,
            oldParentChildren.filter((child) => child.id !== updatedItem.id),
          )
        }
      }

      if (updatedItem.parent !== null) {
        if (!this.childrenMap.has(updatedItem.parent)) {
          this.childrenMap.set(updatedItem.parent, [])
        }
        this.childrenMap.get(updatedItem.parent)!.push(updatedItem)
      }
    }

    Object.assign(existingItem, updatedItem)
    this.itemsMap.set(updatedItem.id, updatedItem)
  }
}
