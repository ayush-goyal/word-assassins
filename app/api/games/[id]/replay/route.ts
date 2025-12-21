import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { generateGameCode } from "@/app/api/utils";
import { GameStatus } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  const { id } = await params;
  const { name } = await request.json();

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "Game name is required" },
      {
        status: 400,
      }
    );
  }

  try {
    const existingGame = await prisma.game.findUnique({
      where: {
        id,
      },
      include: {
        players: true,
      },
    });

    if (!existingGame) {
      return NextResponse.json(
        { error: "Game not found" },
        {
          status: 404,
        }
      );
    }
    if (existingGame.status !== GameStatus.FINISHED) {
      return NextResponse.json(
        { error: "Game is not finished" },
        {
          status: 400,
        }
      );
    }

    // Create new game with same players
    const newGame = await prisma.game.create({
      data: {
        name,
        joinCode: generateGameCode(),
        creatorId: user.id,
        redrawsAlwaysAllowed: existingGame.redrawsAlwaysAllowed,
        hideLeaderboard: existingGame.hideLeaderboard,
        players: {
          create: existingGame.players.map((player) => ({
            userId: player.userId,
            name: player.name,
          })),
        },
      },
      include: {
        players: true,
      },
    });

    return NextResponse.json(newGame);
  } catch (error) {
    console.error("Error cloning game:", error);
    return NextResponse.json(
      { error: "Failed to clone game" },
      {
        status: 500,
      }
    );
  }
}
