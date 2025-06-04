"use server";

import prisma from "./lib/db";
import requireUser from "./lib/hooks";
import { parseWithZod } from "@conform-to/zod";
import {
  EventTypeServerSchema,
  onboardingSchemaValidation,
  SettingSchema,
} from "./lib/zodSchemas";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Server action to create a new event type for the current user
export async function CreateEventTypeAction(
  prevState: any,
  formData: FormData
) {
  const session = await requireUser();

  // Validate form data using Zod schema, including unique URL check
  const submission = await parseWithZod(formData, {
    schema: EventTypeServerSchema({
      async isUrlUnique() {
        const data = await prisma.eventType.findFirst({
          where: {
            userId: session.user?.id,
            url: formData.get("url") as string,
          },
        });
        return !data;
      },
    }),
    async: true,
  });

  // If validation fails, return errors
  if (submission.status !== "success") {
    return submission.reply();
  }

  // Create the event type in the database
  await prisma.eventType.create({
    data: {
      title: submission.value.title,
      duration: submission.value.duration,
      url: submission.value.url,
      description: submission.value.description,
      userId: session.user?.id as string,
      videoCallSoftware: submission.value.videoCallSoftware,
    },
  });

  // Redirect to dashboard after creation
  return redirect("/dashboard");
}

// Server action to handle onboarding form submission and set up user profile and default availability
export async function onBoardingAction(
  prevState: any,
  formData: FormData
) {
  const session = await requireUser();

  // Validate onboarding form data, including unique username check
  const submission = await parseWithZod(formData, {
    schema: onboardingSchemaValidation({
      async isUsernameUnique() {
        const existingUsername = await prisma.user.findUnique({
          where: {
            userName: formData.get("userName") as string,
          },
        });
        return !existingUsername;
      },
    }),
    async: true,
  });

  // If validation fails, return errors
  if (submission.status !== "success") {
    return submission.reply();
  }

  // Update user profile and create default weekly availability
  await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      userName: submission.value.userName,
      name: submission.value.fullName,
      availability: {
        createMany: {
          data: [
            { day: "Monday", fromTime: "08:00", tillTime: "18:00" },
            { day: "Tuesday", fromTime: "08:00", tillTime: "18:00" },
            { day: "Wednesday", fromTime: "08:00", tillTime: "18:00" },
            { day: "Thursday", fromTime: "08:00", tillTime: "18:00" },
            { day: "Friday", fromTime: "08:00", tillTime: "18:00" },
            { day: "Saturday", fromTime: "08:00", tillTime: "18:00" },
            { day: "Sunday", fromTime: "08:00", tillTime: "18:00" },
          ],
        },
      },
    },
  });

  // Redirect to next onboarding step
  return redirect("/onboarding/grant-id");
}

// Server action to update user settings (name and profile image)
export async function SettingAction(
  prevState: any,
  formData: FormData
) {
  const session = await requireUser();

  // Validate settings form data
  const submission = parseWithZod(formData, {
    schema: SettingSchema,
  });

  // If validation fails, return errors
  if (submission.status !== "success") {
    return submission.reply();
  }

  // Update user profile with new settings
  await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      name: submission.value.fullName,
      image: submission.value.porfileImage,
    },
  });

  // Redirect to dashboard after update
  return redirect("/dashboard");
}

// Server action to update user's weekly availability
export async function UpdateAvailabilityActions(formData: FormData) {
  const session = await requireUser();
  const rawData = Object.fromEntries(formData.entries());

  // Parse availability data from form
  const availabilityData = Object.keys(rawData)
    .filter((key) => key.startsWith("id-"))
    .map((key) => {
      const id = key.replace("id-", "");
      return {
        id,
        isActive: rawData[`isActive-${id}`] === "on",
        fromTime: rawData[`fromTime-${id}`] as string,
        tillTime: rawData[`till Time-${id}`] as string,
      };
    });

  try {
    // Update all availability records in a transaction
    await prisma.$transaction(
      availabilityData.map((item) =>
        prisma.availability.update({
          where: { id: item.id },
          data: {
            isActive: item.isActive,
            fromTime: item.fromTime,
            tillTime: item.tillTime,
          },
        })
      )
    );
    // Revalidate the availability page cache
    revalidatePath("/dashboard/availability");
  } catch (error) {
    // Log any errors that occur during update
    console.log(error);
  }
}