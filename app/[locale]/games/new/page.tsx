"use client";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useMutation } from "react-query";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

export default function CreateGamePage() {
  const t = useTranslations("forms");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");

  const formSchema = z.object({
    gameName: z.string().min(2, t("validation.gameNameMinLength")),
    playerName: z.string().min(2, t("validation.nameMinLength")),
    redrawsAlwaysAllowed: z.boolean().default(false),
    hideLeaderboard: z.boolean().default(false),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameName: "",
      playerName: "",
      redrawsAlwaysAllowed: false,
      hideLeaderboard: false,
    },
  });
  const router = useRouter();
  const { mutate: createGame, isLoading } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      console.log(data);
      return axios.post("/api/games", data);
    },
    onError: (error: any) => {
      console.log("here 2");
      console.log(error);
      toast({
        title: tCommon("error"),
        description: error.response?.data?.error || tErrors("somethingWentWrong"),
        variant: "destructive",
      });
    },
    onSuccess: (response: any) => {
      router.push(`/games/${response.data.id}`);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createGame(values);
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("createAGame")}</CardTitle>
          <CardDescription>{t("startNewGame")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 flex flex-col"
            >
              <FormField
                control={form.control}
                name="gameName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("groupName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enterGroupName")}
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="playerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("hostName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enterYourName")}
                        {...field}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="redrawsAlwaysAllowed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("allowWordRedrawsAfterKill")}</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        {t("allowWordRedrawsDescription")}
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hideLeaderboard"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("hidePlayerLeaderboard")}</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        {t("hideLeaderboardDescription")}
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("creating")}
                  </>
                ) : (
                  t("createGame")
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
