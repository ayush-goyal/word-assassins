"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BloodSplatter } from "./blood-splatter";

export default function MarkAsKilledButton({ gameId }: { gameId: string }) {
  const utils = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showBloodSplatter, setShowBloodSplatter] = useState(false);
  const toast = useToast();

  const { mutate: markAsKilled } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(`/api/games/${gameId}/killed`);
      return response.data;
    },
    onMutate: () => {
      setIsLoading(true);
      setShowBloodSplatter(true);
      setTimeout(() => {
        setShowBloodSplatter(false);
      }, 5000);
    },
    onSuccess: () => {
      toast.toast({
        title: "You have been marked as killed",
        description: "You will be removed from the game",
        variant: "default",
      });
      utils.invalidateQueries(["game", gameId]);
    },
    onError: (error: any) => {
      toast.toast({
        title: "Failed to mark as killed",
        description: error.response?.data?.error || "Failed to mark as killed",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  return (
    <>
      <BloodSplatter show={showBloodSplatter} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isLoading}>
            {isLoading ? "Marking as killed..." : "Mark Yourself as Killed"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will mark you as killed and
              remove you from the game.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => markAsKilled()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, mark as killed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
