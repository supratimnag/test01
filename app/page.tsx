"use client";

import { DialogCloseButton } from "@/components/Dialogue";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Greeting from "./Greeting";

export default function Home() {
  const router = useRouter();

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
    //   <h1 className="text-3xl font-bold mb-6">Welcome to my Dashboard</h1>
    //   <Button
    //     className="text-custom-color flex items-center gap-3"
    //     onClick={() => router.push("/dashboard")}
    //   >
    //     <CirclePlus className="h-4 w-4" /> Go to Dashboard
    //   </Button>
    // </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mt-4">
      <div className="bg-primary-foreground p-4 rounded-lg ">
        <DialogCloseButton />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">Test</div>
      <div className="bg-primary-foreground p-4 rounded-lg">Test</div>
      <div className="bg-primary-foreground p-4 rounded-lg">Test</div>
      <div className="bg-primary-foreground p-4 rounded-lg">Test</div>
      <Greeting name="SUPRATIM" />
    </div>
  );
}

{
}
