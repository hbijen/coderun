import { CodeRuntime } from "@/lib/interface";
import { NextResponse } from "next/server";


const SUPPORTED_LANGUAGES = ["c", "c++", "java", "javascript", "python"]

export async function GET() {

    try {

      const runtimes: CodeRuntime[] = await fetch(`${process.env.NEXT_INTERNAL_API_URL}/api/v2/runtimes`).then(r => r.json())

      return NextResponse.json({ data: runtimes.filter(r => SUPPORTED_LANGUAGES.indexOf(r.language) != -1) });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return NextResponse.json({ message: 'Internal server error', error: error.message });
    }
  };
  