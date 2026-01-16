import { Link } from "wouter";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/Button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <GlassCard className="max-w-md w-full text-center p-12">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link href="/" className="w-full">
          <Button className="w-full">Return Home</Button>
        </Link>
      </GlassCard>
    </div>
  );
}
