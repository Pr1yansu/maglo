import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useState, useRef, useEffect } from "react"
import CreditCard, { type CreditCard as CreditCardType } from "./credit-card"

interface StackedCardsProps {
    cards: CreditCardType[]
}

export default function StackedCards({ cards: initialCards }: StackedCardsProps) {
    const [cards, setCards] = useState<CreditCardType[]>(initialCards)
    const [activeIndex, setActiveIndex] = useState(0)
    const cardItemsRef = useRef<(HTMLDivElement | null)[]>([])
    const dotsRef = useRef<(HTMLButtonElement | null)[]>([])

    useGSAP(() => {
        const cardElements = cardItemsRef.current.filter(Boolean)
        const dotElements = dotsRef.current.filter(Boolean)

        cardElements.forEach((el, i) => {
            const offset = (i - activeIndex) * 12
            const scale = 1 - (i - activeIndex) * 0.05
            const opacity = 1 - (i - activeIndex) * 0.15

            gsap.to(el, {
                y: offset,
                scale: scale,
                opacity: opacity,
                duration: 0.6,
                ease: "power2.inOut",
            })
        })

        dotElements.forEach((dot, i) => {
            gsap.to(dot, {
                width: i === activeIndex ? 32 : 8,
                backgroundColor: i === activeIndex ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.3)",
                duration: 0.4,
                ease: "power2.out",
            })
        })
    })

    const moveToTop = (index: number) => {
        if (index === activeIndex) return

        const newCards = [...cards]
        const [movedCard] = newCards.splice(index, 1)
        newCards.unshift(movedCard)
        setCards(newCards)
        setActiveIndex(0)
    }

    return (
        <div className="max-w-md w-full">
            <div className="relative h-72 mb-8">
                {cards.map((card, index) => {
                    const offset = (index - activeIndex) * 12
                    const zIndex = cards.length - index
                    const isVisible = index >= activeIndex && index < activeIndex + 3

                    return (
                        isVisible && (
                            <div
                                key={card.id}
                                ref={(el) => (cardItemsRef.current[index] = el)}
                                className="absolute w-full h-full"
                                style={{
                                    transform: `translateY(${offset}px) scale(${1 - (index - activeIndex) * 0.05})`,
                                    zIndex: zIndex,
                                    opacity: 1 - (index - activeIndex) * 0.15,
                                }}
                            >
                                <CreditCard card={card} onClick={() => moveToTop(index)} />
                            </div>
                        )
                    )
                })}
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                    {cards.map((_, index) => (
                        <button
                            key={index}
                            ref={(el) => (dotsRef.current[index] = el)}
                            onClick={() => moveToTop(index)}
                            className="h-2 rounded-full transition-colors duration-300"
                            style={{
                                width: index === activeIndex ? 32 : 8,
                                backgroundColor: index === activeIndex ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.3)",
                            }}
                            aria-label={`Go to card ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
