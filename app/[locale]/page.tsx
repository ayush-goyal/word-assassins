import { ArrowRight, Shield, Target, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import * as motion from "motion/react-client";
import { GAME_INSTRUCTIONS } from "@/lib/game-instructions";
import { createClient } from "@/utils/supabase/server";
import { Link, routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { getTranslations, setRequestLocale } from "next-intl/server";

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
    },
  },
};

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: (typeof routing.locales)[number] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] mx-6 max-w-screen-xl">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col items-center justify-center space-y-10 text-center min-h-[calc(60vh)]"
      >
        <div className="space-y-6 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl font-bold tracking-tighter"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-[42rem] mx-auto"
          >
            {t("subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col gap-4 justify-center items-center"
          >
            <Button size="lg" asChild>
              <Link href={user ? "/dashboard" : "/sign-up"} className="gap-2">
                {t("startPlaying")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Quick Overview */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="py-8 sm:py-16"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="text-3xl font-bold text-center mb-12"
        >
          {t("quickOverview")}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Overview items with stagger effect */}
          {[
            {
              icon: <Users className="h-6 w-6 text-primary" />,
              title: t("joinGameTitle"),
              description: t("joinGameDescription"),
            },
            {
              icon: <Target className="h-6 w-6 text-primary" />,
              title: t("huntTargetTitle"),
              description: t("huntTargetDescription"),
            },
            {
              icon: <Shield className="h-6 w-6 text-primary" />,
              title: t("stayAliveTitle"),
              description: t("stayAliveDescription"),
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Detailed How to Play */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 0.8 }}
        className="py-16 mb-6 sm:mb-20"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-4"
        >
          {t("howToPlay")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          {t("howToPlaySubtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {GAME_INSTRUCTIONS.map((instruction, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="group"
            >
              <Card className="p-6 space-y-4 transition-shadow duration-200 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center opacity-80"
                    style={{ backgroundColor: instruction.bgClassName }}
                  >
                    <instruction.icon
                      className="h-5 w-5"
                      style={{ color: instruction.iconClassName }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{instruction.title}</h3>
                </div>
                {instruction.isList ? (
                  <ul className="text-muted-foreground text-sm space-y-2">
                    {Array.isArray(instruction.description) ? (
                      instruction.description.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <li>{instruction.description}</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {instruction.description}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
}
