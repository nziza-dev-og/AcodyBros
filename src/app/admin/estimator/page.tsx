import ProjectEstimator from "@/components/admin/ProjectEstimator";
import { Bot } from "lucide-react";

export default function EstimatorPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16 md:px-6">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-4 mb-4">
            <Bot className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">AI Project Estimator</h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Provide project details to get an AI-powered estimation of complexity, cost, and timeline.
        </p>
      </div>
      <ProjectEstimator />
    </div>
  );
}
