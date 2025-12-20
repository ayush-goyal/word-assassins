"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { buildRedirectUrl } from "@/utils/auth";
import { useTranslations } from "next-intl";

export default function ForgotPassword() {
  const t = useTranslations('auth');
  
  const forgotPasswordSchema = z.object({
    email: z.string().email(t('errors.invalidEmail')),
  });
  
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: buildRedirectUrl(
        "/auth/callback",
        "/account/reset-password",
        true
      ),
    });

    if (error) {
      toast({
        title: t('errors.error'),
        description: error.message || t('errors.resetLinkFailed'),
        variant: "destructive",
      });
    } else {
      toast({
        title: t('success.success'),
        description: t('success.resetEmailSent'),
        variant: "default",
      });
      form.reset();
    }
  };

  return (
    <div className="w-full mx-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('resetPassword')}</CardTitle>
          <CardDescription>
            {t('resetPasswordSubtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('emailPlaceholder')}
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('sendingResetLink')}
                  </>
                ) : (
                  t('sendResetLink')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground mt-6">
        {t('rememberPassword')}{" "}
        <Link
          href={buildRedirectUrl("/sign-in")}
          className="text-primary underline-offset-4 hover:underline"
        >
          {t('signIn')}
        </Link>
      </p>
    </div>
  );
}
