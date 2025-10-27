import React from 'react'
import { TransitionProvider, useTransition } from '@/contexts/transition-context'

interface TransitionLayoutProps {
    children: React.ReactNode
}

const TransitionContainer = ({ children }: TransitionLayoutProps) => {
    const { containerRef } = useTransition()

    return (
        <div
            ref={containerRef}
            className="transition-container w-full h-full opacity-100 overflow-hidden relative"
        >
            {children}
        </div>
    )
}

const TransitionLayout = ({ children }: TransitionLayoutProps) => {
    return (
        <TransitionProvider>
            <TransitionContainer>
                {children}
            </TransitionContainer>
        </TransitionProvider>
    )
}

export default TransitionLayout
