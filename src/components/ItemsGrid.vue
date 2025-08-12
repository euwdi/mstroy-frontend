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
  GridApi,
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
    headerName: '№ п\\п',
    colId: 'rowNumber',
    valueGetter: 'node.rowIndex + 1',
    width: 40,
    pinned: 'left',
    cellStyle: { 'font-weight': '600' },
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

const gridApi = ref()

const updateRowNumbers = (api: GridApi) => {
  api.forEachNode((node, index) => {
    node.setDataValue('rowNumber', index + 1);
  });
};

const onGridReady = (params: { api: GridApi }) => {
  gridApi.value = params.api;

  params.api.sizeColumnsToFit();

  params.api.addEventListener('filterChanged', () => updateRowNumbers(params.api));
  params.api.addEventListener('sortChanged', () => updateRowNumbers(params.api));
  params.api.addEventListener('rowGroupOpened', () => updateRowNumbers(params.api));
};
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
