"use client";

import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

interface RemovePlayerButtonProps {
  gameId: string;
  playerId: string;
  currentPlayerId?: string;
}

export function RemovePlayerButton({
  gameId,
  playerId,
  currentPlayerId,
}: RemovePlayerButtonProps) {
  const utils = useQueryClient();
  const { toast } = useToast();

  const { mutate: removePlayer, isLoading } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/games/${gameId}/remove-player`, {
        playerId,
      });
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Player removed from game",
      });
      utils.invalidateQueries(["game", gameId]);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to remove player",
        description: error.response?.data?.error || "Failed to remove player",
        variant: "destructive",
      });
    },
  });

  if (currentPlayerId === playerId) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 rounded-full"
      disabled={isLoading}
      onClick={() => removePlayer()}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
      )}
    </Button>
  );
}
