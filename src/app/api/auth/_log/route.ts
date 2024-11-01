import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {

    console.log('req', req)
    // Ensure the request method is POST
    if (req.method !== 'POST') {
      return NextResponse.json({ message: 'Method not allowed' });
    }
  
    try {
      const data = req.body; // Access the data sent in the request body

      console.log(data)
      console.log(req.json())
  
      return NextResponse.json({ message: 'Data received successfully', data });
    } catch (error: any) {
      return NextResponse.json({ message: 'Internal server error', error: error.message });
    }
  };
  