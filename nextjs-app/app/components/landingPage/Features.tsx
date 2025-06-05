import { CloudRain } from "lucide-react";

const features = [
    {
      name: "Free and Easy Signup",
      description:
        "Create your account instantly and start scheduling meetings without any cost or hassle.",
      icon: CloudRain, // Replace with an appropriate signup icon
    },
    {
      name: "Blazing Fast Performance",
      description:
        "Experience lightning-fast scheduling so you and your clients never waste a second.",
      icon: CloudRain, // Replace with a speed/performance icon
    },
    {
      name: "Secure Integration with Nylas",
      description:
        "Your data and calendars are protected with industry-leading security powered by Nylas.",
      icon: CloudRain, // Replace with a security/shield icon
    },
    {
      name: "User-Friendly Interface",
      description:
        "Intuitive design makes scheduling meetings straightforward and hassle-free for everyone.",
      icon: CloudRain, // Replace with a user-friendly/interface icon
    },
  ];
  

export function Features() {
  return (
    <div className="py-24 ">
      <div className="max-w-2xl mx-auto lg:text-center">
        <p className="font-semibold leading-7 text-primary text-3xl">Schedule faster</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Schedule meetings in minutes
        </h1>
        <p className="mt-6 text-base leading-snug text-muted-foreground">
        With Schedulux, scheduling meetings is effortless and takes only minutes. We streamline the process so you can focus on what matters—connecting with your clients quickly and hassle-free.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-16">
              <div className="text-base font-semibold leading-7">
                <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-primary">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                {feature.name}
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}