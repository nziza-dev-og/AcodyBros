import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Admin Dashboard</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Oversee client requests, manage projects, and access admin tools.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Project Requests</CardTitle>
            <CardDescription>
              View, approve, or decline new project requests from clients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Manage Requests</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Project Estimator</CardTitle>
            <CardDescription>
              Use our AI tool to generate preliminary quotes and timelines for projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/admin/estimator">Go to Estimator</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
