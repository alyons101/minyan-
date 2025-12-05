import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { computeStats } from './services/statsService';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper to get or create a default user for single-user mode
async function getUserId() {
  const users = await prisma.user.findMany();
  if (users.length > 0) {
    return users[0].id;
  }
  const newUser = await prisma.user.create({
    data: { name: 'Default User' }
  });
  return newUser.id;
}

// Routes

// --- Profile ---
app.get('/api/profile', async (req: Request, res: Response) => {
  const userId = await getUserId();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  res.json(user);
});

app.put('/api/profile', async (req: Request, res: Response) => {
  const userId = await getUserId();
  const updated = await prisma.user.update({
    where: { id: userId },
    data: req.body
  });
  res.json(updated);
});

// --- Minyan Logs ---
app.get('/api/minyan-logs', async (req: Request, res: Response) => {
  const userId = await getUserId();
  const logs = await prisma.minyanLog.findMany({
    where: { userId },
    include: { shul: true },
    orderBy: { date: 'desc' }
  });
  res.json(logs);
});

app.post('/api/minyan-logs', async (req: Request, res: Response) => {
  try {
    const userId = await getUserId();
    const { prayer, shulId, notes, travelArea, timestamp, photoUri, shulName } = req.body;

    const log = await prisma.minyanLog.create({
      data: {
        prayerType: prayer,
        date: new Date(timestamp || Date.now()),
        shulId: shulId || undefined,
        shulName: shulName,
        note: notes,
        travelArea,
        photoUri,
        userId
      }
    });
    res.json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create log' });
  }
});

app.put('/api/minyan-logs/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    // Map frontend fields to DB fields if necessary
    // For simplicity, assuming body matches partial MinyanLog
    try {
        const updated = await prisma.minyanLog.update({
            where: { id },
            data: {
                prayerType: data.prayer,
                shulId: data.shulId,
                note: data.notes,
                travelArea: data.travelArea,
                photoUri: data.photoUri,
                date: data.timestamp ? new Date(data.timestamp) : undefined
            }
        });
        res.json(updated);
    } catch (e) {
        res.status(500).json({error: 'Failed to update'});
    }
});

app.delete('/api/minyan-logs/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.minyanLog.delete({ where: { id } });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({error: 'Failed to delete'});
    }
});

// --- Stats ---
app.get('/api/stats', async (req: Request, res: Response) => {
  const userId = await getUserId();
  const logs = await prisma.minyanLog.findMany({
    where: { userId },
    orderBy: { date: 'asc' }
  });
  const stats = computeStats(logs);
  res.json(stats);
});

// --- Shuls ---
app.get('/api/shuls', async (req: Request, res: Response) => {
  const shuls = await prisma.shul.findMany();
  res.json(shuls);
});

app.post('/api/shuls', async (req: Request, res: Response) => {
  const shul = await prisma.shul.create({ data: req.body });
  res.json(shul);
});

app.put('/api/shuls/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const shul = await prisma.shul.update({ where: { id }, data: req.body });
    res.json(shul);
});

app.delete('/api/shuls/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.shul.delete({ where: { id } });
    res.json({success: true});
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
