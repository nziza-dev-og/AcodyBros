
'use client';

import { useState } from "react";
import AcodyAI from "@/components/acodyai/AcodyAI";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sparkles, Wand2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import type { ProjectBrieferOutput } from "@/ai/types";
import { useToast } from "@/hooks/use-toast";


interface AcodyAIWriterProps {
    onDraftReady: (draft: ProjectBrieferOutput) => void;
}

export default function AcodyAIWriter({ onDraftReady }: AcodyAIWriterProps) {
    const [prompt, setPrompt] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const handleUseDraft = (draftText: string) => {
        try {
            const draft: ProjectBrieferOutput = JSON.parse(draftText);
            onDraftReady(draft);
            toast({
                title: "Draft Applied",
                description: "The generated content has been added to the form.",
            });
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Failed to parse AI draft:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to apply the draft. The AI response was not in the correct format.",
            });
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Use AI Assistant
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2"><Wand2 /> AI Project Assistant</DialogTitle>
                    <DialogDescription>
                        Describe your project idea, and the AI will help you create a title, description, and list of key features.
                    </DialogDescription>
                </DialogHeader>
                <div className="px-6 pb-4">
                    <Label htmlFor="ai-prompt" className="sr-only">Your Project Idea</Label>
                    <Textarea
                        id="ai-prompt"
                        placeholder="e.g., 'An app for local gardeners to trade plants and seeds', or 'A website for my bakery that shows my menu and takes custom cake orders'."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={2}
                    />
                </div>
                <div className="flex-grow min-h-0">
                   {isDialogOpen && (
                     <AcodyAI 
                        mode="writer" 
                        initialPrompt={prompt} 
                        onWriterSubmit={handleUseDraft} 
                      />
                   )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
