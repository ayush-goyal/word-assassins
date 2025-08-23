"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "react-query";
import axios from "axios";

export default function StartGameButton({ gameId }: { gameId: string }) {
  const { toast } = useToast();

  const { mutate: startGame, isLoading } = useMutation({
    mutationFn: () => {
      return axios.post(`/api/games/${gameId}/start`);
    },
    onSuccess: () => {
      toast({
        title: "Game started!",
        description: "The game has been started successfully.",
      });
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to start game",
        variant: "destructive",
      });
    },
  });

  return (
    <Button onClick={() => startGame()} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Starting...
        </>
      ) : (
        "Start Game"
      )}
    </Button>
  );
}
