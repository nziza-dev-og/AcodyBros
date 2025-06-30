
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMessageSquare, LayoutTemplate, Smartphone, ShieldCheck, ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// Define codeLines outside the component to prevent it from being recreated on every render.
const codeLines = [
  "<script>",
  "  Alert(' Hello World ');",
  "",
  "  console.log( Hello.length )",
  " }",
  "</script>"
];

export default function Home() {
  const services = [
    {
      icon: <LayoutTemplate className="w-8 h-8 text-primary" />,
      title: "Web Applications",
      description: "Cutting-edge web solutions tailored to your business needs, built with the latest technologies for optimal performance and user experience.",
    },
    {
      icon: <Smartphone className="w-8 h-8 text-primary" />,
      title: "Mobile Applications",
      description: "Beautiful and intuitive mobile apps for iOS and Android that engage your users and grow your brand presence on the go.",
    },
    {
      icon: <BotMessageSquare className="w-8 h-8 text-primary" />,
      title: "AI & Automation",
      description: "Integrate intelligent automation and AI-powered features into your workflow to boost efficiency and unlock new capabilities.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "System Security",
      description: "Comprehensive security audits and hardening to protect your digital assets and ensure your customers' data is safe.",
    },
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "CEO, Innovate Inc.",
      quote: "AcodyBros transformed our vision into a stunning reality. Their expertise and dedication are second to none. The final product exceeded all our expectations!",
      avatar: "https://placehold.co/100x100/7DF9FF/000000.png?text=AJ"
    },
    {
      name: "Samantha Lee",
      role: "Founder, Tech startups",
      quote: "Working with AcodyBros was a breeze. They are true professionals who deliver high-quality work on time. I highly recommend them.",
      avatar: "https://placehold.co/100x100/00FFFF/000000.png?text=SL"
    }
  ];

  const [currentCode, setCurrentCode] = useState('');

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
        if (lineIndex >= codeLines.length) {
            // After finishing all lines, wait for 3 seconds then restart
            timeoutId = setTimeout(() => {
                setCurrentCode('');
                lineIndex = 0;
                charIndex = 0;
                type();
            }, 3000);
            return;
        }

        const currentLine = codeLines[lineIndex];
        
        if (charIndex >= currentLine.length) {
            // End of line, add a newline character
            setCurrentCode(prev => prev + '\n');
            lineIndex++;
            charIndex = 0;
            // Wait a bit longer before starting the next line
            timeoutId = setTimeout(type, 400);
            return;
        }
        
        // Type the next character
        setCurrentCode(prev => prev + currentLine[charIndex]);
        charIndex++;
        // Randomize typing speed a bit
        timeoutId = setTimeout(type, 40 + Math.random() * 40);
    };
    
    // Start the animation after a short delay
    timeoutId = setTimeout(type, 1000);

    // Cleanup function to clear the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, []); // Use an empty dependency array to run the effect only once on mount.

  return (
    <div className="flex flex-col items-center">
      <section className="relative w-full py-20 md:py-28 text-center bg-gray-900/90 overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gray-950 -z-10">
            <pre className="text-left p-4 text-xs sm:text-sm md:text-base">
                <code className="font-code text-green-400/70 whitespace-pre-wrap">
                    {currentCode}
                    <span className="animate-blink text-green-400">|</span>
                </code>
            </pre>
        </div>
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-headline tracking-tighter mb-4 animate-fade-in-up">
              We Build Your{' '}
              <span className="inline-block animate-shine bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent">
                Digital Future
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-200">
              From sleek websites to intelligent applications, AcodyBros Company delivers excellence in code and design, bringing your ideas to life.
            </p>
            <div className="flex gap-4 justify-center animate-fade-in-up delay-400">
              <Button asChild size="lg" className="font-bold">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-bold border-gray-500 hover:bg-gray-700/50">
                <Link href="/about">Learn More <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="w-full py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-background border-border/50 hover:border-primary transition-colors duration-300 transform hover:-translate-y-2">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-4 bg-card rounded-full mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="font-headline">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  <p>{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

       <section id="testimonials" className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-headline">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Image src={testimonial.avatar} alt={testimonial.name} width={50} height={50} className="rounded-full mr-4" />
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-accent fill-accent" />)}
                  </div>
                  <blockquote className="text-foreground italic border-l-4 border-primary pl-4">
                    {testimonial.quote}
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="cta" className="w-full py-20 md:py-28 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">Ready to start a project?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Let's connect and discuss how AcodyBros can help you achieve your goals. We're excited to hear about your next big idea.</p>
          <Button asChild size="lg" className="font-bold bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/dashboard">Request a Quote</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
