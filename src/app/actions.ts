
"use server";

import { z } from "zod";

const inquirySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  message: z.string(),
});

type Inquiry = z.infer<typeof inquirySchema>;

export async function submitInquiry(
  data: Inquiry
): Promise<{ success: boolean; message?: string }> {
  const validation = inquirySchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided." };
  }

  console.log("New Inquiry Received:", validation.data);

  // In a real application, you would add logic here to:
  // 1. Save the inquiry to a database (e.g., Firestore).
  // 2. Send an email notification to your team.
  // 3. Send a confirmation email to the user.

  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    return {
      success: false,
      message: "An error occurred on the server. Please try again later.",
    };
  }
}

const startupInquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  companyName: z.string().min(2),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().min(20),
});

type StartupInquiry = z.infer<typeof startupInquirySchema>;

export async function submitStartupInquiry(
  data: StartupInquiry
): Promise<{ success: boolean; message?: string }> {
  const validation = startupInquirySchema.safeParse(data);
  if (!validation.success) {
    console.log(validation.error.flatten().fieldErrors);
    return { success: false, message: "Invalid data provided." };
  }

  console.log("New Startup Inquiry Received:", validation.data);

  // Here you would typically save to a database, etc.

  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  } catch (error) {
    console.error("Error submitting startup inquiry:", error);
    return {
      success: false,
      message: "An error occurred on the server. Please try again later.",
    };
  }
}
