import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:9000/api";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

// GET /api/seo — fetch all SEO records from backend (server-side, no CORS)
export async function GET() {
    try {
        const res = await fetch(`${BACKEND}/generalSettings/group/seo`, {
            headers: { "Api-Key": API_KEY, "Content-Type": "application/json" },
            cache: "no-store",
        });
        const json = await res.json();
        return NextResponse.json(json);
    } catch (err: any) {
        return NextResponse.json({ data: [], message: err?.message }, { status: 500 });
    }
}

// POST /api/seo — create or update an SEO record
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...payload } = body;
        const authHeader = req.headers.get("Authorization") || "";

        const url = id ? `${BACKEND}/generalSettings/${id}` : `${BACKEND}/generalSettings`;
        const method = id ? "PATCH" : "POST";

        const res = await fetch(url, {
            method,
            headers: {
                "Api-Key": API_KEY,
                "Content-Type": "application/json",
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
            body: JSON.stringify(payload),
        });
        const json = await res.json();
        return NextResponse.json(json, { status: res.status });
    } catch (err: any) {
        return NextResponse.json({ message: err?.message }, { status: 500 });
    }
}
