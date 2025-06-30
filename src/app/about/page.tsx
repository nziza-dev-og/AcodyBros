
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Eye, Code } from "lucide-react";
import Image from "next/image";
import { getAdminTeamMembers } from "./actions";

export default async function AboutPage() {
  const teamMembers = await getAdminTeamMembers();

  const values = [
    { icon: <Target className="w-8 h-8 text-primary" />, title: "Our Mission", description: "To empower businesses with transformative digital solutions, driving growth and innovation through technology." },
    { icon: <Eye className="w-8 h-8 text-primary" />, title: "Our Vision", description: "To be a leading force in the tech industry, recognized for our creativity, quality, and commitment to client success." },
    { icon: <Code className="w-8 h-8 text-primary" />, title: "Our Philosophy", description: "We believe in collaborative partnerships, clean code, and user-centric design to build products that are not just functional, but exceptional." },
  ];

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 md:px-6">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">About AcodyBros Connect</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          We are a passionate team of developers, designers, and strategists dedicated to crafting high-quality digital experiences.
        </p>
      </section>

      <section className="mb-20">
        <Image 
          src="https://i.pinimg.com/736x/c8/7a/a5/c87aa5a2adc0ac60659100f3e880aa41.jpg"
          alt="AcodyBros Team"
          width={1200}
          height={500}
          className="rounded-lg shadow-lg mx-auto"
          data-ai-hint="team collaboration"
        />
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-20 text-center">
        {values.map((value, index) => (
          <Card key={index} className="bg-card border-none shadow-lg">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-background rounded-full">
                  {value.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold font-headline mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline mb-12 flex items-center justify-center gap-3"><Users className="w-10 h-10 text-primary" /> Meet the Team</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div key={member.uid} className="flex flex-col items-center text-center">
                <Image 
                  src={member.photoURL || `https://placehold.co/150x150.png`}
                  alt={member.name} 
                  width={150} 
                  height={150} 
                  className="rounded-full mb-4 shadow-md object-cover"
                  data-ai-hint="person portrait"
                />
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-primary capitalize">{member.role}</p>
                {member.description && (
                  <p className="text-muted-foreground mt-2 text-sm px-4">{member.description}</p>
                )}
              </div>
            ))
          ) : (
             <p className="text-muted-foreground col-span-full">Our team is growing! Check back soon.</p>
          )}
        </div>
      </section>
    </div>
  );
}
