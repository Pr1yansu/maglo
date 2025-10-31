import { cn } from "@/lib/utils"

export interface CreditCard {
    id: string
    cardName: string
    cardNumber: string
    holderName: string
    expiryDate: string
    cardBrand: "visa" | "mastercard" | "amex" | "discover"
    color: "blue" | "green" | "purple" | "orange"
    balance: string
    cardType: "credit" | "debit" | "business"
}

interface CreditCardProps {
    card: CreditCard
    onClick?: () => void
    className?: string
}

const brandLogos = {
    visa: (
        <svg className="w-12 h-8" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="4" fill="currentColor" />
            <text x="50%" y="50%" className="text-white font-bold" textAnchor="middle" dominantBaseline="middle">
                VISA
            </text>
        </svg>
    ),
    mastercard: (
        <svg className="w-12 h-8" viewBox="0 0 48 32" fill="none">
            <circle cx="16" cy="16" r="10" fill="currentColor" opacity="0.8" />
            <circle cx="32" cy="16" r="10" fill="currentColor" opacity="0.6" />
        </svg>
    ),
    amex: (
        <svg className="w-12 h-8" viewBox="0 0 48 32" fill="none">
            <rect width="48" height="32" rx="4" fill="currentColor" />
        </svg>
    ),
    discover: (
        <svg className="w-12 h-8" viewBox="0 0 48 32" fill="none">
            <circle cx="24" cy="16" r="14" fill="currentColor" />
        </svg>
    ),
}

const colorClasses = {
    blue: "from-blue-600 to-blue-800",
    green: "from-emerald-500 to-emerald-700",
    purple: "from-purple-600 to-purple-800",
    orange: "from-orange-500 to-orange-700",
}

const cardTypeStyles = {
    credit: {
        badge: "Credit Card",
        badgeColor: "bg-white/20",
    },
    debit: {
        badge: "Debit Card",
        badgeColor: "bg-emerald-500/30",
    },
    business: {
        badge: "Business Card",
        badgeColor: "bg-amber-500/30",
    },
}

export default function CreditCard({ card, onClick, className = "" }: CreditCardProps) {
    const typeStyle = cardTypeStyles[card.cardType]

    return (
        <div
            onClick={onClick}
            className={cn(
                `relative rounded-2xl bg-gradient-to-br p-6 shadow-2xl overflow-hidden group cursor-pointer transition-all duration-300`,
                className,
                colorClasses[card.color]
            )}
        >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl" />

            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl" />
            </div>

            <div className="relative h-full flex flex-col justify-between min-h-56">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{card.cardName}</p>
                        <div
                            className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${typeStyle.badgeColor}`}
                        >
                            {typeStyle.badge}
                        </div>
                    </div>
                    <div className="text-white/80">{brandLogos[card.cardBrand]}</div>
                </div>

                <div className="space-y-4">
                    <p className="text-white/80 text-lg tracking-widest font-mono">{card.cardNumber}</p>
                    <p className="text-white/70 text-sm font-medium">{card.balance}</p>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider">Card Holder</p>
                        <p className="text-white font-semibold text-sm">{card.holderName}</p>
                    </div>
                    <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider text-right">Expires</p>
                        <p className="text-white font-semibold text-sm">{card.expiryDate}</p>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-200 rounded-2xl" />
        </div>
    )
}
