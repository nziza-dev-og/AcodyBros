
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { submitProjectRequest } from "@/app/dashboard/new-request/actions";
import { Upload, Link as LinkIcon } from "lucide-react";

// Client-side schema for form validation
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(30, { message: "Description must be at least 30 characters." }),
  features: z.string().min(20, { message: "Please list the desired features (min. 20 characters)." }),
  budget: z.string().optional().default(""),
  fileUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>Fill in the form below to get started.</CardDescription>
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
                  <FormLabel>Project Description</FormLabel>
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
