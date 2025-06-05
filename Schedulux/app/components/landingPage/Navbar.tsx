import Link from "next/link";

import { AuthModal } from "./Authmodal";
export function Navbar() {
  return (
    <div className="flex py-5 items-center justify-between">
      <Link href="/" className="flex items-center gap-2" >
       
        <h4 className="text-2xl font-bold">
        Sche<span className="text-primary">dulux</span>
      </h4>
      </Link>
      <AuthModal />
    </div>
  );
}
