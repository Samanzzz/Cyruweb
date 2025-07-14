
"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bootcamp: z.string(),
});

interface EnrollmentFormProps {
  bootcampName: string;
  onBack: () => void;
}

export function EnrollmentForm({ bootcampName, onBack }: EnrollmentFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bootcamp: bootcampName,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("access_key", "318db7ff-a710-47ee-9852-d56ada295461");
    formData.append("subject", `New Bootcamp Enrollment: ${values.bootcamp}`);

    Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
    });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Enrollment Submitted!",
          description: "Thank you for your interest. We'll be in touch soon!",
        });
        form.reset();
        onBack();
      } else {
        console.error("Error from web3forms", data);
        toast({
          variant: "destructive",
          title: "Submission Error",
          description: data.message || "An error occurred while submitting the form.",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Could not submit the form. Please check your connection and try again.",
      });
    }
  };

  return (
    <div className="p-2">
        <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4"/> Back to Details
        </Button>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Full Name*</FormLabel>
                <FormControl>
                    <Input placeholder="Ada Lovelace" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email*</FormLabel>
                <FormControl>
                    <Input placeholder="ada@example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <input type="hidden" {...form.register("bootcamp")} />

            <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : `Enroll in ${bootcampName}`}
            </Button>
        </form>
        </Form>
    </div>
  );
}

