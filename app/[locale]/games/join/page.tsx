"use client";

import { redirect, useRouter, useSearchParams } from "next/navigation";
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
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useMutation } from "react-query";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function JoinGamePage() {
  const t = useTranslations("forms");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const searchParams = useSearchParams();
  const router = useRouter();

  const formSchema = z.object({
    joinCode: z
      .string()
      .length(4, t("validation.joinCodeLength"))
      .regex(/^[A-Z0-9]+$/, t("validation.joinCodeFormat")),
    playerName: z.string().min(2, t("validation.nameMinLength")),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      joinCode: "",
      playerName: "",
    },
  });

  // Set joinCode from URL parameter if available
  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      const formattedCode = code
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 4);
      form.setValue("joinCode", formattedCode);
    }
  }, [searchParams, form]);

  const { mutate: joinGame, isLoading } = useMutation({
    mutationFn: (data: any) => {
      return axios.post("/api/games/join", data);
    },
    onError: (error: any) => {
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

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    joinGame(values);
  };

  return (
    <div className="flex-1 w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("joinAGame")}</CardTitle>
          <CardDescription>
            {t("enterGameCode")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="joinCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("joinCode")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enter4DigitCode")}
                        {...field}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        onChange={(e) => {
                          const value = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "");
                          field.onChange(value);
                        }}
                        maxLength={4}
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("joining")}
                  </>
                ) : (
                  t("joinGame")
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
