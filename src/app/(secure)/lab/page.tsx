"use client"

import { useQuestionStore } from "@/store/question";
import CodeSubmit from "./code-submit";


export default function Lab() {
  const question = useQuestionStore((state) => state.question)

  return (
    <div>
        <div className="text-4xl pt-8 pl-8 pr-8 text-center">Lab Work - NEILIT</div>
        <div className="grid xs:grid-cols-1 xl:grid-cols-2 gap-6 p-8">
          <div className="h-full min-h-[300px] rounded-md border bg-muted p-4">{question}</div>
          <div className="h-full lg:min-h-[700px] xl:min-h-[700px] gap-4">
            <CodeSubmit></CodeSubmit>
          </div>
        </div>
    </div>
  );
}

