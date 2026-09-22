const { parentPort, workerData } = require("worker_threads");

// тяжёлая синхронная работа, которая заблокировала бы главный поток
function crunch(n) {
  let sum = 0;
  for (let i = 0; i < n; i++) sum += Math.sqrt(i);
  return sum;
}

const result = crunch(workerData.limit);
parentPort.postMessage(result); // отправляем результат обратно
