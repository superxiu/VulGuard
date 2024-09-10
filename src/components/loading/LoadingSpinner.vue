<template>
  <div v-if="visible" class="loading-overlay">
    <trinity-rings-spinner
      :animation-duration="1500"
      :size="66"
      color="#4E74F5"
    />
  </div>
</template>

<script>
import { TrinityRingsSpinner } from 'epic-spinners';
import { visible } from '@/services/loadingService/loadingService';

export default {
  setup() {
    return {
      visible
    };
  },
  components: {
    TrinityRingsSpinner
  }
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #222222;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
