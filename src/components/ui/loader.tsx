
'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { cn } from '@/lib/utils';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: number;
    text?: string;
}

const Loader = ({ className, size = 64, text = "Loading...", ...props }: LoaderProps) => {
    const animationRef = useRef<anime.AnimeInstance | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const numCircles = 5;

    useEffect(() => {
        if (wrapperRef.current) {
            animationRef.current = anime.timeline({
                loop: true,
                easing: 'easeInOutSine',
            }).add({
                targets: wrapperRef.current.querySelectorAll('.circle'),
                scale: (el: any, i: number) => 1 + i * 0.25,
                opacity: [1, 0],
                duration: 1500,
                delay: anime.stagger(150),
            });
        }
        return () => {
            animationRef.current?.pause();
        };
    }, []);

    return (
        <div className={cn("flex flex-col items-center justify-center gap-6", className)} {...props}>
            <div 
                ref={wrapperRef} 
                className="relative"
                style={{ width: size, height: size }}
            >
                {[...Array(numCircles)].map((_, i) => (
                    <div
                        key={i}
                        className="circle absolute inset-0 rounded-full border-2 border-primary"
                        style={{
                            transformOrigin: 'center center'
                        }}
                    />
                ))}
            </div>
            <p className="text-muted-foreground">{text}</p>
        </div>
    );
};

export { Loader };
