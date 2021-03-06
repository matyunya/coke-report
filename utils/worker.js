function createWorker(fn) {
  const code = fn.toString().replace(/^function.+?\{/g, '').slice(0, -1);
  const blob = new Blob([code], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);

  return new Worker(url);
}

export default function makeWorker(bodyFunction) {
  const worker = createWorker(bodyFunction);
  const runningTasks = new Map();

  worker.onmessage = event => {
    const { type, taskId, entityId, output } = event.data;
    const request = runningTasks.get(entityId);

    if (!request || request.taskId !== taskId) return;
    const response = type === 'error' ? [new Error(output)] : [null, output];

    runningTasks.delete(entityId);
    for (let cb of request.callbacks) cb(...response);
  };

  return function runTask(entityId, params, cb) {
    const taskId = String(Math.random());
    const { callbacks } = runningTasks.get(entityId) || { callbacks: [] };
    callbacks.push(cb);

    runningTasks.set(entityId, { taskId, callbacks });

    worker.postMessage({ taskId, entityId, ...params });
  }
}
