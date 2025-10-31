import StackedCards from '@/components/ui/stacked-credit-cards'
import { type CreditCard as CreditCardType } from '@/components/ui/credit-card'

export const demoCards: CreditCardType[] = [
    {
        id: "1",
        cardName: "Personal Account",
        cardNumber: "**** **** **** 4729",
        holderName: "Priyansu Chowdhury",
        expiryDate: "12/27",
        cardBrand: "visa",
        color: "blue",
        balance: "$4,250.32",
        cardType: "credit",
    },
    {
        id: "2",
        cardName: "Daily Expenses",
        cardNumber: "**** **** **** 8352",
        holderName: "Priyansu Chowdhury",
        expiryDate: "08/26",
        cardBrand: "mastercard",
        color: "orange",
        balance: "$1,578.45",
        cardType: "debit",
    },
    {
        id: "3",
        cardName: "Business Wallet",
        cardNumber: "**** **** **** 9011",
        holderName: "Priyansu Chowdhury",
        expiryDate: "03/29",
        cardBrand: "amex",
        color: "green",
        balance: "$12,890.00",
        cardType: "business",
    },
    {
        id: "4",
        cardName: "Travel Rewards",
        cardNumber: "**** **** **** 2204",
        holderName: "Priyansu Chowdhury",
        expiryDate: "11/28",
        cardBrand: "discover",
        color: "purple",
        balance: "$2,431.76",
        cardType: "credit",
    },
]

const Wallets = () => {
    return (
        <div>
            <StackedCards cards={demoCards} />
        </div>
    )
}

export default Wallets
