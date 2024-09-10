import { defineStore } from 'pinia';

export const useProtectionStore = defineStore('protection', {
  state: () => ({
    severityData: {
      severityBefore: [1, 1, 2, 4, 20],
      severityAfter: [0, 0, 0, 3, 14]
    },
    otherData: {}
  }),
  actions: {
    setSeverityData(data) {
      console.log('Setting severity data:', data);
      this.severityData = data;
    },
    setOtherData(data) {
      console.log('Setting other data:', data);
      this.otherData = data;
    }
  },
  getters: {
    getSeverityData: (state) => {
      console.log('Getting severity data:', state.severityData);
      return state.severityData;
    },
    getOtherData: (state) => state.otherData
  }
});
