import { SEO } from '../components/seo'
import { Button, Input } from '../components/ui'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form'
import { ModeToggle } from '../components/mode-toggle'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"

const formSchema = z.object({
  username: z.string().min(2).max(50),
})

const LoginPage = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <>
      <SEO title="Login" />
      <section className='grid-cols-2 grid min-h-screen relative'>
        {/* Theme toggle in top right corner */}
        <div className="absolute top-4 right-4 z-10">
          <ModeToggle />
        </div>

        <div className='col-span-1 flex justify-center items-center bg-background'>
          <div className='max-w-[75%] w-full p-5'>
            <div className='max-w-96'>
              <div>
                <h2 className='text-foreground text-2xl font-semibold mb-2'>Welcome back</h2>
                <p className='text-muted-foreground mb-8 text-sm'>Welcome back! Please enter your details.</p>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
        <div className='col-span-1 bg-foreground'></div>
      </section>
    </>
  )
}

export default LoginPage
