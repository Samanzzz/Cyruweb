"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target as HTMLFormElement);

    formData.append("access_key", "318db7ff-a710-47ee-9852-d56ada295461");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully");
        (event.target as HTMLFormElement).reset();
      } else {
        console.log("Error", data);
        setResult(data.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setResult("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name*</Label>
          <Input id="name" type="text" name="name" placeholder="Adam Gelius" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email*</Label>
          <Input id="email" type="email" name="email" placeholder="example@yourmail.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone*</Label>
          <Input id="phone" type="text" name="phone" placeholder="+885 1254 5211 552" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website URL (optional)</Label>
          <Input id="website" type="text" name="website" placeholder="https://example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message*</Label>
          <Textarea id="message" name="message" placeholder="Type your message here" className="min-h-[120px]" required />
        </div>
        <Button type="submit" className="w-full">Send us a Message</Button>
      </form>
      {result && <p className="text-sm text-center text-muted-foreground pt-4">{result}</p>}
    </div>
  );
}