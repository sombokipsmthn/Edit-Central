import { NextResponse } from "next/server";
import { listWorkspaceData } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const workspace = listWorkspaceData();
  return NextResponse.json(workspace);
}
