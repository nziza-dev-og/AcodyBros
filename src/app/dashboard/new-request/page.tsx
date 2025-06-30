
import ProjectRequestForm from "@/components/dashboard/ProjectRequestForm";
import { FilePlus2 } from "lucide-react";

export default function NewRequestPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 md:px-6">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-4 mb-4">
            <FilePlus2 className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">New Project Request</h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Tell us about your project. The more details you provide, the better we can assist you.
        </p>
      </div>
      <ProjectRequestForm />
    </div>
  );
}
