import { cancelMeetingAction } from "@/app/actions";
import { EmptyState } from "@/app/components/EmptyState";
import { SubmitButton } from "@/app/components/SubmitButtons";

import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/db";
import { nylas } from "@/app/lib/nylas";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { format, fromUnixTime } from "date-fns";
import { Icon, Video } from "lucide-react";

import React from "react";

// Helper to extract startTime and endTime from the When object
function getStartEndTime(when: any): { startTime?: number; endTime?: number } {
  // The Nylas Event "when" can be one of several shapes
  // We expect either { startTime, endTime } (Timespan/Time) or { date } (Date)
  if ("startTime" in when && "endTime" in when) {
    return { startTime: when.startTime, endTime: when.endTime };
  }
  if ("time" in when) {
    // Single time (not a range)
    return { startTime: when.time, endTime: when.time };
  }
  if ("date" in when) {
    // All-day event
    // Nylas docs: date is in YYYY-MM-DD, so we can parse as Date
    const date = new Date(when.date + "T00:00:00Z");
    const unix = Math.floor(date.getTime() / 1000);
    return { startTime: unix, endTime: unix };
  }
  if ("startDate" in when && "endDate" in when) {
    // All-day range
    const start = new Date(when.startDate + "T00:00:00Z");
    const end = new Date(when.endDate + "T00:00:00Z");
    return {
      startTime: Math.floor(start.getTime() / 1000),
      endTime: Math.floor(end.getTime() / 1000),
    };
  }
  return {};
}

// Helper to extract conferencing URL
function getConferencingUrl(conferencing: any): string | undefined {
  // Nylas Event "conferencing" can be { details: { url } } or { autocreate: {}, provider }
  if (conferencing && "details" in conferencing && conferencing.details?.url) {
    return conferencing.details.url;
  }
  // Sometimes, autocreate may have a url (rare)
  if (conferencing && "autocreate" in conferencing && conferencing.autocreate?.url) {
    return conferencing.autocreate.url;
  }
  // Sometimes, url is at the root
  if (conferencing && conferencing.url) {
    return conferencing.url;
  }
  return undefined;
}

async function getData(userId: string) {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      grantId: true,
      grantEmail: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }
  const data = await nylas.events.list({
    identifier: userData?.grantId as string,
    queryParams: {
      calendarId: userData?.grantEmail as string,
    },
  });

  return data;
}

const MeetingsPage = async () => {
  const session = await auth();
  const data = await getData(session?.user?.id as string);

  return (
    <>
      {data.data.length < 1 ? (
        <EmptyState
          title="No meetings found"
          description="You don't have any meetings yet."
          buttonText="Create a new event type"
          href="/dashboard/new"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              See upcoming and past events booked through your event type links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.data.map((item) => {
              const { startTime, endTime } = getStartEndTime(item.when);
              const meetingUrl = getConferencingUrl(item.conferencing);
              return (
                <form key={item.id} action={cancelMeetingAction}>
                  <input type="hidden" name="eventId" value={item.id} />
                  <div className="grid grid-cols-3 justify-between items-center">
                    <div>
                      <p className="text-muted-foreground text-sm">
                        {startTime
                          ? format(fromUnixTime(startTime), "EEE, dd MMM")
                          : "Unknown date"}
                      </p>
                      <p className="text-muted-foreground text-xs pt-1">
                        {startTime
                          ? format(fromUnixTime(startTime), "hh:mm a")
                          : "?"}{" "}
                        -{" "}
                        {endTime
                          ? format(fromUnixTime(endTime), "hh:mm a")
                          : "?"}
                      </p>
                      {meetingUrl && (
                        <div className="flex items-center mt-1">
                          <Video className="size-4 mr-2 text-primary" />{" "}
                          <a
                            className="text-xs text-primary underline underline-offset-4"
                            target="_blank"
                            href={meetingUrl}
                          >
                            Join Meeting
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <h2 className="text-sm font-medium">{item.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        You and {item.participants?.[0]?.name ?? "Guest"}
                      </p>
                    </div>
                    <SubmitButton
                      text="Cancel Event"
                      variant="destructive"
                      className="w-fit flex ml-auto"
                    />
                  </div>
                  <Separator className="my-3" />
                </form>
              );
            })}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MeetingsPage;
