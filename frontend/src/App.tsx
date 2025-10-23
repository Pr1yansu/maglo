import { Button } from '@/components/ui/button'
import { SEO } from '@/components/SEO'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'
import { usePerformanceMetrics } from '@/lib/performance'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Monitor performance metrics
  usePerformanceMetrics()

  useGSAP(() => {
    gsap.from(containerRef.current, {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power2.out'
    })
  }, [])

  return (
    <>
      <SEO />

      <div ref={containerRef} className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Welcome to Maglo
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              A modern web application built with React, TypeScript, NestJS, GraphQL, and Drizzle ORM.
            </p>
            <Button size="lg">
              Get Started
            </Button>
          </div>
        </main>
      </div>
    </>
  )
} export default App