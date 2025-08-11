export const mockItems = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: 'child1', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: 'child1', label: 'Айтем 4' },
  { id: 5, parent: 'child1', label: 'Айтем 5' },
  { id: 6, parent: 'child1', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]