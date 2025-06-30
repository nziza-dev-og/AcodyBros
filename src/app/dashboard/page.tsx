import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Client Dashboard</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Manage your projects, submit new requests, and communicate with our team.
        </p>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Submit a New Project Request</CardTitle>
          <CardDescription>
            Have a new idea? Fill out the form to get a quote and timeline estimate.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-muted-foreground">The project request form will be here.</p>
          <Button>Start a New Request</Button>
        </CardContent>
      </Card>
    </div>
  );
}
