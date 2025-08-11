export type Item = {
  id: number | string
  parent: number | string | null
  [key: string]: any
}

export interface ITreeStore {
  getAll(): Item[]
  getItem(id: string | number): Item | undefined
  getChildren(id: string | number): Item[]
  getAllChildren(id: string | number): Item[]
  getAllParents(id: string | number): Item[]
  addItem(item: Item): void
  removeItem(id: string | number): void
  updateItem(updatedItem: Item): void
}
