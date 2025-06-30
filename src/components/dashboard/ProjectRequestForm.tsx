
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export const projectRequestSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(30, { message: "Description must be at least 30 characters." }),
  features: z.string().min(20, { message: "Please list the desired features (min. 20 characters)." }),
  budget: z.string().optional(),
  userId: z.string().min(1, { message: "User must be logged in." }),
});

export type ProjectRequestInput = z.infer<typeof projectRequestSchema>;

export default function ProjectRequestForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const form = useForm<ProjectRequestInput>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      features: "",
      budget: "",
      userId: user?.uid || "",
    },
  });
  
  useEffect(() => {
    if (user?.uid) {
      form.setValue("userId", user.uid);
    }
  }, [user, form]);

  async function onSubmit(values: ProjectRequestInput) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to submit a request.",
      });
      return;
    }
    
    setLoading(true);
    const result = await submitProjectRequest({ ...values, userId: user.uid });
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
                  <FormLabel>Estimated Budget (Optional)</FormLabel>
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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading || !user} className="w-full font-bold">
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
