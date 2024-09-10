import { ref } from 'vue';

const visible = ref(false);

const showLoading = () => {
  visible.value = true;
};

const hideLoading = () => {
  visible.value = false;
};

export { visible, showLoading, hideLoading };
