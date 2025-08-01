
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { submitProjectRequest, getAIBrief } from "@/app/dashboard/new-request/actions";
import { Upload, Link as LinkIcon, Sparkles, Wand2, FileText, ListChecks } from "lucide-react";
import type { ProjectBrieferOutput } from "@/ai/flows/project-briefer-flow";
import { Skeleton } from "../ui/skeleton";


// Client-side schema for form validation
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(30, { message: "Description must be at least 30 characters." }),
  features: z.string().min(20, { message: "Please list the desired features (min. 20 characters)." }),
  budget: z.string().optional().default(""),
  fileUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

const AIWriterDialog = ({ onDraftReady }: { onDraftReady: (draft: ProjectBrieferOutput) => void }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [draft, setDraft] = useState<ProjectBrieferOutput | null>(null);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (prompt.trim().length < 10) {
            toast({ variant: "destructive", title: "Prompt too short", description: "Please provide a bit more detail about your idea." });
            return;
        }
        setIsLoading(true);
        setDraft(null);
        try {
            const result = await getAIBrief({ prompt });
            setDraft(result);
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "Failed to generate draft. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleUseDraft = () => {
        if(draft) {
            onDraftReady(draft);
            toast({ title: "Draft Applied", description: "The generated content has been added to the form."});
        }
    };

    return (
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Wand2 /> AI Project Assistant</DialogTitle>
                <DialogDescription>
                    Describe your project idea, and the AI will help you create a title, description, and list of key features.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="ai-prompt">Your Project Idea</Label>
                    <Textarea 
                        id="ai-prompt"
                        placeholder="e.g., 'An app for local gardeners to trade plants and seeds', or 'A website for my bakery that shows my menu and takes custom cake orders'."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        disabled={isLoading}
                    />
                </div>
                <Button onClick={handleGenerate} disabled={isLoading || prompt.trim().length < 10}>
                    {isLoading ? "Generating..." : <><Sparkles className="mr-2 h-4 w-4" /> Generate Draft</>}
                </Button>
            </div>
            
            {(isLoading || draft) && (
                <div className="space-y-6 pt-4 border-t">
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-1/3" />
                             <Skeleton className="h-6 w-1/4" />
                             <Skeleton className="h-20 w-full" />
                             <Skeleton className="h-6 w-1/4 mt-4" />
                             <Skeleton className="h-16 w-full" />
                        </div>
                    ) : draft && (
                        <div className="space-y-4">
                             <div>
                                 <h3 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4 text-primary"/>Generated Title</h3>
                                 <p className="text-muted-foreground p-3 bg-muted rounded-md">{draft.title}</p>
                             </div>
                             <div>
                                 <h3 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4 text-primary"/>Generated Description</h3>
                                 <p className="text-muted-foreground p-3 bg-muted rounded-md whitespace-pre-wrap">{draft.description}</p>
                             </div>
                             <div>
                                 <h3 className="font-semibold mb-2 flex items-center gap-2"><ListChecks className="h-4 w-4 text-primary"/>Generated Key Features</h3>
                                 <p className="text-muted-foreground p-3 bg-muted rounded-md whitespace-pre-wrap">{draft.keyFeatures}</p>
                             </div>
                        </div>
                    )}
                     <DialogClose asChild>
                         <Button onClick={handleUseDraft} disabled={!draft} className="w-full">
                            Use This Draft
                        </Button>
                    </DialogClose>
                </div>
            )}
        </DialogContent>
    )

}

export default function ProjectRequestForm() {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      features: "",
      budget: "",
      fileUrl: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if(file) {
        form.setValue("fileUrl", "");
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to submit a request.",
      });
      return;
    }
    
    setLoading(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("features", values.features);
    formData.append("budget", values.budget || "");
    formData.append("userId", user.uid);

    if (selectedFile) {
        formData.append("file", selectedFile);
    } else if (values.fileUrl) {
        formData.append("fileUrl", values.fileUrl);
    }

    const result = await submitProjectRequest(formData);
    setLoading(false);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: result.error,
      });
    } else {
      toast({
        title: "Success!",
        description: "Your project request has been submitted.",
      });
      router.push("/dashboard");
    }
  }
  
  const handleDraftReady = (draft: ProjectBrieferOutput) => {
    form.setValue('title', draft.title);
    form.setValue('description', draft.description);
    form.setValue('features', draft.keyFeatures);
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Fill in the form below to get started.</CardDescription>
            </div>
             <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Use AI Assistant
                    </Button>
                </DialogTrigger>
                <AIWriterDialog onDraftReady={handleDraftReady} />
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., E-commerce Website for My Brand" {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                   <div className="flex items-center justify-between">
                     <FormLabel>Project Description</FormLabel>
                   </div>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project in detail. What are its goals? Who is the target audience?"
                      rows={6}
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Features</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the main features you need. e.g., User accounts, product pages, shopping cart, admin panel..."
                      rows={4}
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Budget</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a budget range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="<5000">Less than $5,000</SelectItem>
                      <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                      <SelectItem value=">50000">More than $50,000</SelectItem>
                       <SelectItem value="not-sure">I'm not sure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Project Document (Optional)</FormLabel>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload" onClick={() => { form.setValue('fileUrl', '')}}>
                    <Upload className="mr-2 h-4 w-4" /> Upload File
                  </TabsTrigger>
                  <TabsTrigger value="url" onClick={() => setSelectedFile(null)}>
                    <LinkIcon className="mr-2 h-4 w-4" /> Provide URL
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <Card>
                    <CardContent className="pt-6">
                      <FormControl>
                        <Input
                          type="file"
                          onChange={handleFileChange}
                          disabled={loading}
                        />
                      </FormControl>
                      {selectedFile && <p className="text-sm text-muted-foreground mt-2">Selected: {selectedFile.name}</p>}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="url">
                  <Card>
                    <CardContent className="pt-6">
                      <FormField
                        control={form.control}
                        name="fileUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/document.pdf"
                                {...field}
                                disabled={loading}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setSelectedFile(null);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </FormItem>

            <Button type="submit" disabled={loading || !user?.uid} className="w-full font-bold">
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
