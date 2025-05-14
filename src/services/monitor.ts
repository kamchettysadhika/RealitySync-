import { Router, Response, Request } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();
const MONITOR_CSV_PATH = path.join(__dirname, '..', '..', 'monitor.csv');

router.get('/monitor', (_req: Request, res: Response) => {
  if (fs.existsSync(MONITOR_CSV_PATH)) {
    res.setHeader('Content-Type', 'text/csv');
    fs.createReadStream(MONITOR_CSV_PATH).pipe(res);
  } else {
    res.status(404).send('Monitor file not found');
  }
});

export default router;
