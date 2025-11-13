"use strict";
const common_vendor = require("../common/vendor.js");
const STORAGE_KEY = "ANYDOOR_DOWNLOAD_TASKS";
const safeStorage = {
  get() {
    if (typeof common_vendor.index !== "undefined" && common_vendor.index.getStorageSync) {
      return common_vendor.index.getStorageSync(STORAGE_KEY);
    }
    if (typeof localStorage !== "undefined") {
      const cached = localStorage.getItem(STORAGE_KEY);
      return cached ? JSON.parse(cached) : [];
    }
    return [];
  },
  set(value) {
    const payload = JSON.parse(JSON.stringify(value));
    if (typeof common_vendor.index !== "undefined" && common_vendor.index.setStorageSync) {
      common_vendor.index.setStorageSync(STORAGE_KEY, payload);
    } else if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
  }
};
common_vendor.defineStore("download", {
  state: () => ({
    tasks: safeStorage.get() || []
  }),
  getters: {
    activeTasks: (state) => state.tasks.filter((item) => item.status === "pending" || item.status === "downloading"),
    completedTasks: (state) => state.tasks.filter((item) => item.status === "success"),
    failedTasks: (state) => state.tasks.filter((item) => item.status === "error")
  },
  actions: {
    addTask(payload) {
      const exists = this.tasks.find((item) => item.id === payload.id);
      if (exists)
        return;
      this.tasks.unshift({
        id: payload.id,
        name: payload.name || "未命名文件",
        progress: payload.progress || 0,
        status: payload.status || "pending",
        createdAt: payload.createdAt || Date.now(),
        meta: payload.meta || {}
      });
      this.persist();
    },
    updateTask(id, data) {
      const target = this.tasks.find((item) => item.id === id);
      if (!target)
        return;
      Object.assign(target, data);
      if (typeof data.progress === "number") {
        target.progress = Math.min(100, Math.max(0, data.progress));
      }
      this.persist();
    },
    removeTask(id) {
      this.tasks = this.tasks.filter((item) => item.id !== id);
      this.persist();
    },
    clearAll() {
      this.tasks = [];
      this.persist();
    },
    persist() {
      safeStorage.set(this.tasks);
    }
  }
});
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/useDownloadStore.js.map
