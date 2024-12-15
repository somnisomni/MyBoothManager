import cluster from "node:cluster";

export default defineNitroPlugin(() => {
  if(cluster.isPrimary) {
    console.info("[nitro] Primary server process started");
  } else if(cluster.isWorker && cluster.worker) {
    console.info(`[nitro] Worker server process started, with cluster ID ${cluster.worker.id} and PID ${cluster.worker.process.pid}`);
  } else {
    console.info("[nitro] Server process started without clustering");
  }
});
