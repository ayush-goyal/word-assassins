import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const game = await prisma.game.findUnique({
      where: {
        id,
        players: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        players: {
          omit: {
            targetId: true,
            word: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!game) {
      return NextResponse.json(null, { status: 404 });
    }

    const currentPlayer = await prisma.playerInGame.findUnique({
      where: {
        userId_gameId: {
          userId: user.id,
          gameId: game.id,
        },
      },
      include: {
        target: {
          omit: {
            targetId: true,
          },
        },
      },
    });

    const response = {
      ...game,
      currentPlayerTarget: currentPlayer?.target,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500 }
    );
  }
}
