<template>
  <div class="tree-container">
    <ag-grid-vue class="ag-theme-alpine" 
      :columnDefs="columnDefs" 
      :rowData="rowData" 
      :defaultColDef="defaultColDef"
      :treeData="true" 
      :getDataPath="getDataPath" 
      :autoGroupColumnDef="autoGroupColumnDef"
      :groupDefaultExpanded="groupDefaultExpanded" 
      :animateRows="true" @grid-ready="onGridReady" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TreeStore } from '../stores/TreeStore'

type Props = {
  treeStore: TreeStore
}
const { treeStore } = defineProps<Props>()

const getDataPath = computed(() => (data: any) => {
  const path = [data.id]
  let parentId = data.parent

  while (parentId) {
    const parent = treeStore.getItem(parentId)
    if (!parent) break
    path.unshift(parent.id)
    parentId = parent.parent
  }

  return path
})

const columnDefs = ref([
  {
    headerName: '№ п/п',
    valueGetter: 'node.rowIndex + 1',
    width: 100,
    pinned: 'left'
  },
  {
    headerName: 'Категория',
    valueGetter: (params: any) => {
      return treeStore.getChildren(params.data.id).length > 0
        ? 'Группа'
        : 'Элемент'
    },
    width: 120
  },
  {
    headerName: 'Наименование',
    field: 'label',
    flex: 1,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      suppressCount: true
    }
  }
])

const defaultColDef = ref({
  sortable: true,
  filter: true,
  resizable: true
})

const autoGroupColumnDef = ref({
  headerName: 'Группа',
  minWidth: 250,
  cellRendererParams: {
    suppressCount: true,
    innerRenderer: (params: any) => params.data.label
  }
})

const groupDefaultExpanded = ref(1)

const rowData = computed(() => treeStore.getAll())

const onGridReady = (params: any) => {
  params.api.sizeColumnsToFit()
}
</script>

<style scoped>
.tree-container {
  height: 600px;
  width: 100%;
}

.ag-theme-alpine {
  height: 100%;
}
</style>
