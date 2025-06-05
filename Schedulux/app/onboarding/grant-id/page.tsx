import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "@/components/ui/card";
  import Image from "next/image";
  import VideoGif from "@/public/work-is-almost-over-happy.gif"; // adjust path if needed
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarCheck2 } from "lucide-react";
  
  export default function OnboardingRoutetwo() {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              You Are Almost Done!
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              We now need to connect your calendar to your account.
            </CardDescription>
            <Image
              src={VideoGif}
              alt="Calendar connection demo"
              className="mx-auto rounded-md"
              width={260} 
              height={180}
            /> 
          </CardHeader>
  
          <CardContent>
            <Button className="w-full" asChild>
                <Link href = "/api/auth ">
                <CalendarCheck2 className="size- mr-2"/>
                Connect Your Calender Account
                </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  