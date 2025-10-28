"use client"

import { useRef, useState } from "react"
import gsap from "gsap"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import SendIcon from "@/components/assets/send"
import AddToCartButton from "@/components/ui/cart-btn"

gsap.registerPlugin(MorphSVGPlugin)

const formSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
})

const Login = () => {
    const ref = useRef<SVGSVGElement>(null)
    const pathRef = useRef<SVGPathElement>(null)
    const btnRef = useRef<HTMLButtonElement>(null)
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
        if (loading) return
        setLoading(true)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Example@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="w-full text-end">
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                        Forgot Password?
                    </Link>
                </div>
                <Button type="submit" className="w-full flex items-center justify-center gap-2"
                    ref={btnRef}
                >
                    Submit
                    <SendIcon />
                </Button>
            </form>
        </Form>
    )
}

export default Login
