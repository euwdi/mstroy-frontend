<template>
  <div class="tree-container">
    <ag-grid-vue 
      class="ag-theme-alpine" 
      :columnDefs="columnDefs" 
      :rowData="rowData" 
      :defaultColDef="defaultColDef"
      :treeData="true" 
      :getDataPath="getDataPath" 
      :autoGroupColumnDef="autoGroupColumnDef"
      :groupDefaultExpanded="groupDefaultExpanded" 
      :animateRows="true" 
      @grid-ready="onGridReady" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ITreeStore, Item } from '@/types/tree';
import { AgGridVue } from 'ag-grid-vue3';
import type {
  ColDef,
} from 'ag-grid-community';

type Props = {
  treeStore: ITreeStore
}
const { treeStore } = defineProps<Props>()

const defaultColDef = {
  sortable: false,
  filter: false,
  resizable: false
}

const groupDefaultExpanded = ref(1)

const rowData = computed(() => treeStore.getAll())

const getDataPath = (data: Item) => {
  const path = [String(data.id)];
  let parentId = data.parent;

  while (parentId !== null) {
    const parent = treeStore.getItem(parentId);
    if (!parent) break;
    path.unshift(String(parent.id));
    parentId = parent.parent;
  }

  return path;
};

const columnDefs = ref<ColDef[]>([
  {
    headerName: '№ п/п',
    valueGetter: 'node.rowIndex + 1',
    width: 20,
    pinned: 'left'
  },
  {
    headerName: 'Наименование',
    field: 'label',
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      suppressCount: true
    }
  }
])

const autoGroupColumnDef = ref<ColDef>({
  headerName: 'Категория',
  minWidth: 250,
  cellRendererParams: {
    suppressCount: true,
    innerRenderer: (params: any) => {
      const hasChildren = treeStore.getChildren(params.data.id).length > 0;
      return hasChildren ? 'Группа' : 'Элемент';
    },
  },
});

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
