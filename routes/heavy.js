const express = require("express");
const path = require("path");
const { Worker } = require("worker_threads");
const { asyncHandler } = require("../utils/validationError");

const router = express.Router();

// та же функция, что и в воркере — для сравнения "в лоб" на главном потоке
function crunch(n) {
  let sum = 0;
  for (let i = 0; i < n; i++) sum += Math.sqrt(i);
  return sum;
}

function runInWorker(limit) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, "../workers/heavy.worker.js"), {
      workerData: { limit },
    });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Воркер упал с кодом ${code}`));
    });
  });
}

// блокирует главный поток целиком, пока не досчитает
const heavyBlockingHandler = (req, res) => {
  const result = crunch(1e9);
  return res.json({ result });
};

// та же нагрузка, но вынесенная в worker_threads — не блокирует главный поток
const heavyWorkerHandler = asyncHandler(async (req, res) => {
  const result = await runInWorker(1e9);
  return res.json({ result });
});

router.get("/heavy-blocking", heavyBlockingHandler);
router.get("/heavy", heavyWorkerHandler);

module.exports = router;
