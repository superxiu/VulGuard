import { defineStore } from 'pinia';

export const useTestStore = defineStore('testStore', {
  state: () => ({
    taskIPs: new Set(),
  }),
  actions: {
    addTaskIP(ip) {
      this.taskIPs.add(ip);
    },
    checkTaskIP(ip) {
      return this.taskIPs.has(ip);
    },
    removeTaskIP(ip) {
        this.taskIPs.delete(ip);
    },
    clearTaskIPs(ip) {
        this.taskIPs.clear(ip);
    }
  },
});
