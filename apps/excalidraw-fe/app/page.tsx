import Image from "next/image";
import Signin from "./signin/page";
import Signup from "./signup/page";
import Link from "next/link";
import { Button } from "@repo/ui/button";

export default function Home() {
  return (
    <>
 
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className=" flex gap-10">  
      <Button variant={"outline"}><Link href="/signin" >Signin</Link></Button>   
      <Button variant={"outline"}><Link href="/signup" >Signup</Link></Button> 
         </div>
   
    </div>
    </>
  );
}
