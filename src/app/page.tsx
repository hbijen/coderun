import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {

  return (
    <div>
      <div className="text-4xl pt-8 pl-8 pr-8 text-center">Welcome To NEILIT Lab Work</div>
      <div className="flex min-h-[350px] w-full justify-center p-10 items-center">
        <Button variant="default" asChild>
          <Link href="/lab">Goto Lab</Link>
        </Button>
      </div>
    </div>
  );
}

