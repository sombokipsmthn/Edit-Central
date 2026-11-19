import { NextRequest, NextResponse } from "next/server";
import { createCollectionInDb, deleteCollectionInDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { name?: string; description?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!body.name?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Collection name is required." },
      { status: 400 }
    );
  }

  const collection = createCollectionInDb({
    name: body.name,
    description: body.description,
  });
  return NextResponse.json({ ok: true, collection }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Missing collection id." },
      { status: 400 }
    );
  }

  const deleted = deleteCollectionInDb(id);
  if (!deleted) {
    return NextResponse.json(
      { ok: false, error: "Collection not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
