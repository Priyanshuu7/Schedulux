import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";

import { GitHubAuthButton, GoogleAuthButton } from "../SubmitButtons";
import { signIn } from "@/app/lib/auth";

export function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="font-semibold cursor-pointer">Try for free</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader className="flex flex-row justify-center items-center gap-2">
          <DialogTitle className="text-3xl font-semibold">
            Sche
            <span className="text-primary">dulux</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col mt-5 gap-3">
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
            className="w-full"
          >
            <GoogleAuthButton />
          </form>
          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
            className="w-full"
          >
            <GitHubAuthButton />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
