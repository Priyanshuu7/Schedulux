import { EditEventTypeForm } from "@/app/components/EditEventTypeForm";
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import React from "react";

async function getData(eventTypeid: string) {
  const data = await prisma.eventType.findUnique({
    where: {
      id: eventTypeid,
    },
    select: {
      title: true,
      description: true,
      duration: true,
      url: true,
      id: true,
      videoCallSoftware: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}
const EditEventTypePage = async ({
  params,
}: {
  params: Promise<{ eventTypeid: string }>;
}) => {
  const { eventTypeid } = await params;
  const data = await getData(eventTypeid);

  return (
    <EditEventTypeForm
      description={data.description}
      duration={data.duration}
      title={data.title}
      url={data.url}
      key={data.id}
      id={data.id}
      callProvider={data.videoCallSoftware}
    />
  );
};

export default EditEventTypePage;
