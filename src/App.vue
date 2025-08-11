<template>
  <div class="tree-page">
    <ItemsGrid :treeStore="treeStore" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ItemsGrid from './components/ItemsGrid.vue';
import { mockItems } from './stores/mock';
import { TreeStore } from './stores/TreeStore';

const treeStore = ref(new TreeStore(mockItems));

</script>

<style>
.tree-page {
  padding: 20px;
  font-family: Arial, sans-serif;
}
</style>
