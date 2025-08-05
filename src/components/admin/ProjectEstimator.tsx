"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "@/components/ui/loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProjectEstimatorInput, ProjectEstimatorOutput } from "@/ai/flows/project-estimator";
import { getProjectEstimate } from "@/app/admin/estimator/actions";
import { AlertCircle, CheckCircle2, Clock, DollarSign, Puzzle, FileText } from "lucide-react";

const formSchema = z.object({
  projectDescription: z.string().min(50, { message: "Please provide a detailed description (min. 50 characters)." }),
  desiredFeatures: z.string().min(20, { message: "Please list the desired features (min. 20 characters)." }),
  complexityLevel: z.enum(['low', 'medium', 'high']),
});

export default function ProjectEstimator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProjectEstimatorOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectDescription: "",
      desiredFeatures: "",
      complexityLevel: "medium",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await getProjectEstimate(values as ProjectEstimatorInput);
      setResult(response);
    } catch (e) {
      setError("An unexpected error occurred. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="text-primary"/>Project Details</CardTitle>
          <CardDescription>Fill in the details below to generate an estimate.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A web platform for online course creation and sales, with user authentication, payment processing, and a student dashboard..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desiredFeatures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Features</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., User login/signup, course upload, Stripe integration, video streaming, quiz functionality, certificates..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="complexityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anticipated Complexity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a complexity level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full font-bold">
                {loading ? "Generating Estimate..." : "Generate Estimate"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Analysis in Progress...</CardTitle>
            <CardDescription>The AI is analyzing your project details.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            <Loader text="Generating analysis..."/>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="shadow-lg border-primary">
          <CardHeader>
             <CardTitle className="flex items-center gap-2"><CheckCircle2 className="text-green-400" /> Estimation Complete</CardTitle>
            <CardDescription>Here is the preliminary analysis of the project.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><Puzzle className="text-accent" /> Estimated Complexity</h3>
                <p className="text-muted-foreground p-4 bg-background rounded-md">{result.estimatedComplexity}</p>
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><DollarSign className="text-accent"/> Preliminary Quote</h3>
                <p className="text-muted-foreground p-4 bg-background rounded-md">{result.preliminaryQuote}</p>
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><Clock className="text-accent"/> Estimated Timeline</h3>
                <p className="text-muted-foreground p-4 bg-background rounded-md">{result.estimatedTimeline}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
