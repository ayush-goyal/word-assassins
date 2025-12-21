"use client";

import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StartGameButton from "./start-game-button";
import { Game, GameStatus, PlayerInGame, PlayerStatus } from "@prisma/client";
import { GameStatusBadge } from "@/components/game-status-badge";
import MarkAsKilledButton from "./mark-as-killed-button";
import { AnimatedCrown } from "./animated-crown";
import RedrawWordButton from "./redraw-word-button";
import { Sword, Loader2, AlertCircle } from "lucide-react";
import ReplayGameDialog from "./replay-game-dialog";
import { RemovePlayerButton } from "./remove-player-button";
import { useGameInstructions } from "@/lib/game-instructions";
import CopyJoinLinkButton from "./copy-join-link-button";
import { useQuery } from "react-query";
import { use } from "react";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";
import { useTranslations, useLocale } from "next-intl";
import { translateWord } from "@/lib/master-word-list";

async function fetchGameData(gameId: string): Promise<
  Game & {
    players: PlayerInGame[];
    currentPlayerTarget: PlayerInGame | null;
  }
> {
  const response = await axios.get(`/api/games/${gameId}`);
  return response.data;
}

export default function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: gameId } = use(params);
  const { user } = useAuth();
  const gameInstructions = useGameInstructions();
  const t = useTranslations("game");
  const locale = useLocale();

  const {
    data: game,
    isLoading,
    error,
  } = useQuery(["game", gameId], () => fetchGameData(gameId), {
    enabled: !!gameId,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 10000, //  10 seconds
  });

  if (!user || !gameId || isLoading) {
    return (
      <div className="flex-1 w-full max-w-3xl mx-auto p-4">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-lg font-medium">{t("loading")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    if ((error as Error).message === "Game not found") {
      notFound();
    }
    return (
      <div className="flex-1 w-full max-w-3xl mx-auto p-4">
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-6" />
            <h2 className="text-xl font-semibold mb-2 text-destructive">
              {t("errorLoading")}
            </h2>
            <p className="text-muted-foreground text-center">
              {(error as Error).message}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t("refreshHint")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!game) {
    notFound();
  }

  const isCreator = game.creatorId === user.id;
  const currentPlayer = game.players.find(
    (player) => player.userId === user.id
  );
  const currentPlayerTarget = game.currentPlayerTarget;

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 space-y-8 mb-3">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <GameStatusBadge status={game.status} />
          <h1 className="text-3xl font-bold">{game.name}</h1>
          <p className="text-muted-foreground">
            {t("joinCode")}: {game.joinCode}
          </p>
          {game.status === GameStatus.WAITING && (
            <CopyJoinLinkButton joinCode={game.joinCode} />
          )}
        </div>
        <div className="flex gap-3">
          {isCreator && game.status === GameStatus.WAITING && (
            <StartGameButton gameId={game.id} />
          )}
          {isCreator && game.status === GameStatus.FINISHED && (
            <ReplayGameDialog gameId={game.id} gameName={game.name} />
          )}
        </div>
      </div>

      {game.status === GameStatus.ACTIVE &&
        currentPlayerTarget &&
        currentPlayerTarget.status === PlayerStatus.ALIVE && (
          <Card>
            <CardHeader>
              <CardTitle>{t("yourTarget")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{currentPlayerTarget.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("theirWord")}{" "}
                      <span className="font-bold">
                        {currentPlayerTarget.word
                          ? translateWord(currentPlayerTarget.word, locale)
                          : ""}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={
                        currentPlayerTarget.status === PlayerStatus.ALIVE
                          ? "default"
                          : "destructive"
                      }
                    >
                      {currentPlayerTarget.status === PlayerStatus.ALIVE
                        ? t("alive")
                        : t("eliminated")}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {game.status === GameStatus.ACTIVE &&
        currentPlayer?.status === PlayerStatus.ALIVE && (
          <Card>
            <CardHeader>
              <CardTitle>{t("actions")}</CardTitle>
            </CardHeader>
            <CardContent className="sm:items-center gap-4 flex sm:flex-row flex-col">
              <MarkAsKilledButton gameId={game.id} />
              <RedrawWordButton game={game} currentPlayer={currentPlayer} />
            </CardContent>
          </Card>
        )}

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>{t("gameMembers")}</span>
            <Badge variant="outline">
              {game.players.length}{" "}
              {game.players.length === 1 ? t("player") : t("players")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {game.players
              .sort((a, b) => (a.status === PlayerStatus.ALIVE ? -1 : 1))
              .map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{player.name}</p>
                      {game.winnerId === player.id && <AnimatedCrown />}
                      {player.userId === game.creatorId && (
                        <Badge variant="secondary" className="text-xs">
                          {t("host")}
                        </Badge>
                      )}
                      {game.status === GameStatus.ACTIVE &&
                        !game.hideLeaderboard && (
                          <Badge
                            variant={
                              player.status === PlayerStatus.ALIVE
                                ? "default"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {player.status}
                          </Badge>
                        )}
                      {((!game.hideLeaderboard &&
                        game.status === GameStatus.ACTIVE) ||
                        game.status === GameStatus.FINISHED) && (
                        <Badge
                          variant="secondary"
                          className="text-xs flex items-center gap-1"
                        >
                          <Sword className="w-3 h-3" />
                          {player.kills}{" "}
                          {player.kills === 1 ? t("kill") : t("kills")}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {game.status === GameStatus.WAITING && isCreator && (
                    <RemovePlayerButton
                      gameId={game.id}
                      playerId={player.userId}
                      currentPlayerId={currentPlayer?.userId}
                    />
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* How to Play Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("howToPlay")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {gameInstructions.map((instruction, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center opacity-80"
                    style={{ backgroundColor: instruction.bgClassName }}
                  >
                    <instruction.icon
                      className="h-4 w-4"
                      style={{ color: instruction.iconClassName }}
                    />
                  </div>
                  <h3 className="font-semibold">{instruction.title}</h3>
                </div>
                {instruction.isList ? (
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {Array.isArray(instruction.description) ? (
                      instruction.description.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <li>{instruction.description}</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {instruction.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
