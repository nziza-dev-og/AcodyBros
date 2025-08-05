
'use client';

import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { cn } from '@/lib/utils';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: number;
    text?: string;
}

const Loader = ({ className, size = 48, text = "Loading...", ...props }: LoaderProps) => {
    const animationRef = useRef<anime.AnimeInstance | null>(null);
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (pathRef.current) {
            // Set initial dash offset
            const pathLength = pathRef.current.getTotalLength();
            pathRef.current.style.strokeDasharray = `${pathLength} ${pathLength}`;
            pathRef.current.style.strokeDashoffset = `${pathLength}`;

            animationRef.current = anime({
                targets: pathRef.current,
                strokeDashoffset: [anime.setDashoffset, 0],
                easing: 'easeInOutSine',
                duration: 1500,
                delay: function(el, i) { return i * 250 },
                direction: 'alternate',
                loop: true
            });
        }

        return () => {
            animationRef.current?.pause();
        };
    }, []);

    return (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)} {...props}>
            <svg 
                width={size} 
                height={size} 
                viewBox="0 0 48 48" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="-rotate-90"
            >
                <path 
                    ref={pathRef}
                    d="M24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4Z" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            </svg>
            <p className="text-muted-foreground">{text}</p>
        </div>
    );
};

export { Loader };
