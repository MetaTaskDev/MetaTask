import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCurrentTrack, useTodayProgress, useToggleProgress } from "@/hooks/use-tracks";
import { GlassCard } from "@/components/GlassCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/Button";
import { format } from "date-fns";
import { Check, Lock, Loader2, Trophy, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: track, isLoading: isTrackLoading } = useCurrentTrack();
  const { data: progress, isLoading: isProgressLoading } = useTodayProgress();
  const toggleProgress = useToggleProgress();
  const [_, setLocation] = useLocation();

  // Redirect if no assessment
  useEffect(() => {
    if (user && !user.lastAssessmentDate) {
      setLocation("/assessment");
    }
  }, [user, setLocation]);

  if (isAuthLoading || isTrackLoading || isProgressLoading || !user || !track) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate completion
  const allTasks = track.pillars.flatMap(p => p.tasks);
  const completedTaskIds = progress?.map((p: any) => p.taskId) || [];
  const completedCount = completedTaskIds.length;
  const totalCount = allTasks.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  // Calculate day of year (out of 365) - simplified
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

  // Confetti effect on 100% completion
  useEffect(() => {
    if (completionPercentage === 100) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [completionPercentage]);

  const handleToggle = (taskId: number) => {
    const today = format(new Date(), "yyyy-MM-dd");
    toggleProgress.mutate({ taskId, date: today });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <div className="relative bg-gradient-to-b from-primary/10 to-transparent pt-12 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">
                Good morning, {user.name.split(" ")[0]}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Track Level {track.level}: {track.title}
              </p>
            </div>
            
            <GlassCard className="px-4 py-2 flex flex-col items-center min-w-[100px] !bg-white/50">
              <span className="text-2xl font-bold font-mono">{365 - dayOfYear}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Days Left</span>
            </GlassCard>
          </div>

          {/* Daily Progress Card */}
          <GlassCard gradient className="relative overflow-hidden">
            <div className="flex justify-between items-end mb-4 relative z-10">
              <div>
                <h3 className="text-lg font-semibold">Daily Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {completedCount} of {totalCount} tasks completed
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-primary">{Math.round(completionPercentage)}%</span>
              </div>
            </div>
            <ProgressBar progress={completionPercentage} className="h-3 relative z-10" />
            
            {/* Background decoration */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          </GlassCard>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 -mt-10">
        <h2 className="text-xl font-bold mb-6">Today's Agenda</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {track.pillars.map((pillar: any) => (
            <div key={pillar.id} className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                {pillar.category}
              </h3>
              
              <div className="space-y-3">
                {pillar.tasks.map((task: any) => {
                  const isCompleted = completedTaskIds.includes(task.id);
                  
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={false}
                      className={`relative group cursor-pointer`}
                      onClick={() => handleToggle(task.id)}
                    >
                      <GlassCard className={`p-4 flex items-start gap-4 transition-all duration-300 ${
                        isCompleted 
                          ? "bg-primary/5 border-primary/20 opacity-80" 
                          : "hover:-translate-y-1 hover:shadow-lg"
                      }`}>
                        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isCompleted 
                            ? "bg-primary border-primary text-white" 
                            : "border-muted-foreground/30 group-hover:border-primary"
                        }`}>
                          {isCompleted && <Check className="w-3 h-3" />}
                        </div>
                        
                        <div className="flex-1">
                          <p className={`font-medium text-sm transition-all ${
                            isCompleted ? "text-muted-foreground line-through decoration-primary/50" : "text-foreground"
                          }`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                              {task.frequencyPerWeek}x / week
                            </span>
                            {task.isHabit && (
                              <span className="text-[10px] flex items-center text-orange-500">
                                <Flame className="w-3 h-3 mr-0.5" /> Habit
                              </span>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Banner (if not premium) */}
      {!user.isPremium && (
        <div className="max-w-5xl mx-auto px-6 mt-12 mb-24">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Unlock Levels 2-4</h3>
                <p className="text-gray-300 max-w-md">
                  Take your life design to the next level. Access advanced tracks, analytics, and community features.
                </p>
              </div>
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 border-none min-w-[150px]"
                onClick={() => window.location.href = "https://buy.stripe.com/7sY3cueLgguW1Cj7xA1Jm00"}
              >
                Upgrade Now <Lock className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            {/* Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>
      )}

      {/* Simple Bottom Nav for Mobile */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-full px-6 py-3 flex items-center gap-8 z-50">
        <button className="text-primary p-2">
          <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-primary rounded-[1px]" />
          </div>
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-2">
          <Trophy className="w-6 h-6" />
        </button>
        <div className="w-px h-6 bg-border" />
        <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-xs text-white font-medium flex items-center justify-center">
          {user.name.charAt(0)}
        </button>
      </div>
    </div>
  );
}
