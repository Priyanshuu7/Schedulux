import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { AuthModal } from "./Authmodal";
export function Navbar() {
  return (
    <div className="flex py-5 items-center justify-between">
      <Link href="/" className="flex items-center gap-2" >
        <Image src={Logo} alt="Logo" className="size-10" />
        <h4 className="text-2xl font-bold">
        Saas <span className="text-blue-500">App</span>
      </h4>
      </Link>
      <AuthModal />
    </div>
  );
}
