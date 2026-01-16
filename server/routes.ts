import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  if (!(await storage.isEmpty())) return;

  console.log("Seeding database...");

  // TRILHA NÍVEL 1: O Arquiteto da Base
  const track1 = await storage.createTrack({
    level: 1,
    title: "O Arquiteto da Base",
    description: "Saia do modo automático e retome as rédeas.",
    objective: "Retomar as rédeas da biologia e do tempo.",
  });

  // Pillars Track 1
  const t1_p1 = await storage.createTrackPillar({ trackId: track1.id, category: "Exercício", description: "30 min de caminhada ou treino leve" });
  await storage.createDailyTask({ trackPillarId: t1_p1.id, title: "Caminhada 30min", frequencyPerWeek: 3, isHabit: true });
  
  const t1_p2 = await storage.createTrackPillar({ trackId: track1.id, category: "Alimentação", description: "Regra 80/20" });
  await storage.createDailyTask({ trackPillarId: t1_p2.id, title: "Aplicar regra 80/20", frequencyPerWeek: 7, isHabit: true });

  const t1_p3 = await storage.createTrackPillar({ trackId: track1.id, category: "Sono", description: "Dormir 7h-8h" });
  await storage.createDailyTask({ trackPillarId: t1_p3.id, title: "Dormir 7h-8h (Horário fixo)", frequencyPerWeek: 7, isHabit: true });

  const t1_p4 = await storage.createTrackPillar({ trackId: track1.id, category: "Finanças", description: "Mapear gastos" });
  await storage.createDailyTask({ trackPillarId: t1_p4.id, title: "Mapear gastos e evitar juros", frequencyPerWeek: 1, isHabit: true });

  const t1_p5 = await storage.createTrackPillar({ trackId: track1.id, category: "Mente", description: "Mindfulness" });
  await storage.createDailyTask({ trackPillarId: t1_p5.id, title: "5 min Mindfulness ao acordar", frequencyPerWeek: 7, isHabit: true });

  const t1_p6 = await storage.createTrackPillar({ trackId: track1.id, category: "Intelecto", description: "Ler 1 capítulo" });
  await storage.createDailyTask({ trackPillarId: t1_p6.id, title: "Ler 1 capítulo do livro do mês", frequencyPerWeek: 7, isHabit: true });

  const t1_p7 = await storage.createTrackPillar({ trackId: track1.id, category: "Relacionamentos", description: "Tempo de qualidade" });
  await storage.createDailyTask({ trackPillarId: t1_p7.id, title: "Tempo de qualidade sem telas", frequencyPerWeek: 1, isHabit: true });
  
  const t1_p8 = await storage.createTrackPillar({ trackId: track1.id, category: "Legado", description: "Reflexão" });
  await storage.createDailyTask({ trackPillarId: t1_p8.id, title: "Reflexão: Identificar uma causa", frequencyPerWeek: 1, isHabit: false });


  // TRILHA NÍVEL 2: O Atleta da Performance
  const track2 = await storage.createTrack({
    level: 2,
    title: "O Atleta da Performance",
    description: "Ganhar tração e clareza mental.",
    objective: "Força e clareza mental superior.",
  });
  
  const t2_p1 = await storage.createTrackPillar({ trackId: track2.id, category: "Exercício", description: "Treino de Força" });
  await storage.createDailyTask({ trackPillarId: t2_p1.id, title: "Treino de Força (Musculação/Calistenia)", frequencyPerWeek: 4, isHabit: true });
  
  const t2_p2 = await storage.createTrackPillar({ trackId: track2.id, category: "Alimentação", description: "Zero ultraprocessados" });
  await storage.createDailyTask({ trackPillarId: t2_p2.id, title: "Zero ultraprocessados + Jejum 12h", frequencyPerWeek: 7, isHabit: true });

  const t2_p3 = await storage.createTrackPillar({ trackId: track2.id, category: "Sono", description: "Higiene do sono rigorosa" });
  await storage.createDailyTask({ trackPillarId: t2_p3.id, title: "Higiene do sono (Zero telas 1h antes)", frequencyPerWeek: 7, isHabit: true });

  const t2_p4 = await storage.createTrackPillar({ trackId: track2.id, category: "Finanças", description: "Aporte na Reserva" });
  await storage.createDailyTask({ trackPillarId: t2_p4.id, title: "Aporte na Reserva de Emergência", frequencyPerWeek: 1, isHabit: true }); // Monthly but treating as 1x week for simplicity or we handle monthly logic later

  const t2_p5 = await storage.createTrackPillar({ trackId: track2.id, category: "Mente", description: "Meditação + Journaling" });
  await storage.createDailyTask({ trackPillarId: t2_p5.id, title: "20 min Meditação + Journaling", frequencyPerWeek: 7, isHabit: true });

  const t2_p6 = await storage.createTrackPillar({ trackId: track2.id, category: "Intelecto", description: "Hard Skill" });
  await storage.createDailyTask({ trackPillarId: t2_p6.id, title: "Estudo de nova língua/Hard Skill", frequencyPerWeek: 3, isHabit: true });

  const t2_p7 = await storage.createTrackPillar({ trackId: track2.id, category: "Relacionamentos", description: "Networking" });
  await storage.createDailyTask({ trackPillarId: t2_p7.id, title: "Networking: Conectar com alguém", frequencyPerWeek: 1, isHabit: true }); // Monthly


  // TRILHA NÍVEL 3: O Mestre do Equilíbrio
  const track3 = await storage.createTrack({
    level: 3,
    title: "O Mestre do Equilíbrio",
    description: "Impactar o ambiente e atingir Flow.",
    objective: "Atingir o estado de Flow.",
  });
  
  const t3_p1 = await storage.createTrackPillar({ trackId: track3.id, category: "Exercício", description: "HIIT + Mobilidade" });
  await storage.createDailyTask({ trackPillarId: t3_p1.id, title: "Treino HIIT + Mobilidade/Yoga", frequencyPerWeek: 5, isHabit: true });
  
  const t3_p2 = await storage.createTrackPillar({ trackId: track3.id, category: "Alimentação", description: "Nutrição Funcional" });
  await storage.createDailyTask({ trackPillarId: t3_p2.id, title: "Nutrição Funcional Personalizada", frequencyPerWeek: 7, isHabit: true });

  const t3_p3 = await storage.createTrackPillar({ trackId: track3.id, category: "Sono", description: "Dados de sono" });
  await storage.createDailyTask({ trackPillarId: t3_p3.id, title: "Análise de dados de sono profundo/REM", frequencyPerWeek: 7, isHabit: true });

  const t3_p4 = await storage.createTrackPillar({ trackId: track3.id, category: "Finanças", description: "Diversificação" });
  await storage.createDailyTask({ trackPillarId: t3_p4.id, title: "Diversificação Internacional", frequencyPerWeek: 1, isHabit: true }); // Monthly

  const t3_p5 = await storage.createTrackPillar({ trackId: track3.id, category: "Mente", description: "Filosofia" });
  await storage.createDailyTask({ trackPillarId: t3_p5.id, title: "Estudo filosófico / Controle emocional", frequencyPerWeek: 7, isHabit: true });

  const t3_p6 = await storage.createTrackPillar({ trackId: track3.id, category: "Intelecto", description: "Escrita/Síntese" });
  await storage.createDailyTask({ trackPillarId: t3_p6.id, title: "Escrita/Síntese (Blog ou Mentoria)", frequencyPerWeek: 1, isHabit: true });

  const t3_p7 = await storage.createTrackPillar({ trackId: track3.id, category: "Relacionamentos", description: "Mentorar" });
  await storage.createDailyTask({ trackPillarId: t3_p7.id, title: "Mentorar alguém mais jovem", frequencyPerWeek: 1, isHabit: true });


  // TRILHA NÍVEL 4: O Ícone da Transcendência
  const track4 = await storage.createTrack({
    level: 4,
    title: "O Ícone da Transcendência",
    description: "Longevidade e Liberdade Total.",
    objective: "Imortalidade Simbólica.",
  });
  
  const t4_p1 = await storage.createTrackPillar({ trackId: track4.id, category: "Exercício", description: "Longevidade" });
  await storage.createDailyTask({ trackPillarId: t4_p1.id, title: "Treino de Longevidade Funcional", frequencyPerWeek: 7, isHabit: true });
  
  const t4_p2 = await storage.createTrackPillar({ trackId: track4.id, category: "Alimentação", description: "Orgânica" });
  await storage.createDailyTask({ trackPillarId: t4_p2.id, title: "Dieta Orgânica/Produção Própria", frequencyPerWeek: 7, isHabit: true });

  const t4_p3 = await storage.createTrackPillar({ trackId: track4.id, category: "Sono", description: "Maestria Circadiana" });
  await storage.createDailyTask({ trackPillarId: t4_p3.id, title: "Maestria Circadiana", frequencyPerWeek: 7, isHabit: true });

  const t4_p4 = await storage.createTrackPillar({ trackId: track4.id, category: "Finanças", description: "Gestão Patrimônio" });
  await storage.createDailyTask({ trackPillarId: t4_p4.id, title: "Gestão e Distribuição de Patrimônio", frequencyPerWeek: 1, isHabit: true }); // Monthly

  const t4_p5 = await storage.createTrackPillar({ trackId: track4.id, category: "Mente", description: "Presença" });
  await storage.createDailyTask({ trackPillarId: t4_p5.id, title: "Estado de Presença Constante", frequencyPerWeek: 7, isHabit: true });

  const t4_p6 = await storage.createTrackPillar({ trackId: track4.id, category: "Intelecto", description: "Legado" });
  await storage.createDailyTask({ trackPillarId: t4_p6.id, title: "Trabalho no Legado (Livro/Fundação)", frequencyPerWeek: 7, isHabit: true });

  const t4_p7 = await storage.createTrackPillar({ trackId: track4.id, category: "Relacionamentos", description: "Comunidade" });
  await storage.createDailyTask({ trackPillarId: t4_p7.id, title: "Construção de Comunidade/Clã", frequencyPerWeek: 1, isHabit: true });

  console.log("Database seeded successfully!");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  // Initialize DB data
  seedDatabase();

  // Tracks
  app.get(api.tracks.getCurrent.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    const track = await storage.getTrackWithDetails(user.currentTrackLevel);
    if (!track) return res.status(404).json({ message: "Track not found" });
    res.json(track);
  });

  app.get(api.tracks.getAll.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const tracks = await storage.getTracks();
    res.json(tracks);
  });

  // Progress
  app.get(api.progress.getToday.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    const progress = await storage.getTodayProgress(user.id);
    res.json(progress);
  });

  app.post(api.progress.toggle.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    // Basic validation
    try {
      const { taskId, date } = req.body;
      if (!taskId || !date) return res.status(400).send("Missing taskId or date");
      
      await storage.toggleTaskProgress(user.id, taskId, date);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ message: "Error toggling task" });
    }
  });

  // Assessment
  app.post(api.assessment.submit.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    const { answers, recommendedLevel } = req.body;

    await storage.saveAssessment(user.id, answers);
    
    // Update user's level
    const updatedUser = await storage.updateUser(user.id, {
      currentTrackLevel: recommendedLevel,
    });

    res.json({ success: true, newLevel: updatedUser.currentTrackLevel });
  });

  // Billing (Mock Upgrade)
  app.post(api.billing.upgrade.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    
    // In a real app, this would be a webhook from Stripe
    // For now, we assume the frontend sends this after a "successful" interaction or just for testing
    // But actually, the prompt says "Upgrade Modal with Link". It doesn't say we need to process the payment yet.
    // So this endpoint might just be for manual testing or if we add a "I already paid" button.
    // Let's allow upgrading for demo purposes if needed, or just return success.
    
    await storage.updateUser(user.id, { isPremium: true });
    res.json({ success: true });
  });

  return httpServer;
}
