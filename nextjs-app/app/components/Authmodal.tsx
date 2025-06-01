import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {DialogTrigger} from "@/components/ui/dialog";
import Logo from "@/public/logo.png";
import Image from "next/image";
import {signIn} from "../lib/auth";
import {GitHubAuthButton, GoogleAuthButton} from "./SubmitButtons";
export function AuthModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="font-semibold cursor-pointer">
                    Try for free
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[360px]">
                <DialogHeader className="flex flex-row justify-center items-center gap-2">
                    <Image src={Logo} alt="Logo" className="size-10"/>
                    <DialogTitle className="text-3xl font-semibold">
                        Saas
                        <span className="text-primary">App</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col mt-5 gap-3">

                    <form
                        action={async() => {
                        "use server";
                        await signIn("google")
                    }}
                        className="w-full">
                        <GoogleAuthButton/>

                    </form >
                    <form action={async() => {
                        "use server";
                        await signIn("github")
                    }}
                        className="w-full">
                              <GitHubAuthButton/>
                        </form>
                  

                </div>
            </DialogContent>
        </Dialog>
    )
}