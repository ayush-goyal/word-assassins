import { Play, Target, Shield, Book, MessageSquare, Crown } from "lucide-react";
import { LucideIcon } from "lucide-react";
import colors from "tailwindcss/colors";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

type GameInstruction = {
  icon: LucideIcon;
  title: string;
  description: string | string[];
  iconClassName: string;
  bgClassName: string;
  isList?: boolean;
};

// Client-side hook
export const useGameInstructions = (): GameInstruction[] => {
  const t = useTranslations('libGameInstructions');
  
  return [
    {
      icon: Play,
      title: t('gettingStarted'),
      description: t('gettingStartedDescription'),
      iconClassName: colors.zinc[200],
      bgClassName: colors.zinc[800],
    },
    {
      icon: Target,
      title: t('makingAKill'),
      description: t('makingAKillDescription'),
      iconClassName: colors.red[200],
      bgClassName: colors.red[800],
    },
    {
      icon: Shield,
      title: t('stayingAlive'),
      description: t('stayingAliveDescription'),
      iconClassName: colors.blue[200],
      bgClassName: colors.blue[800],
    },
    {
      icon: Book,
      title: t('wordRules'),
      description: [
        t('wordRulesDescription.0'),
        t('wordRulesDescription.1'),
        t('wordRulesDescription.2'),
      ],
      iconClassName: colors.purple[200],
      bgClassName: colors.purple[800],
      isList: true,
    },
    {
      icon: MessageSquare,
      title: t('fairPlay'),
      description: t('fairPlayDescription'),
      iconClassName: colors.green[200],
      bgClassName: colors.green[800],
    },
    {
      icon: Crown,
      title: t('winningLib'),
      description: t('winningLibDescription'),
      iconClassName: colors.yellow[200],
      bgClassName: colors.yellow[800],
    },
  ];
};

// Server-side function
export const getGameInstructions = async (): Promise<GameInstruction[]> => {
  const t = await getTranslations('libGameInstructions');
  
  return [
    {
      icon: Play,
      title: t('gettingStarted'),
      description: t('gettingStartedDescription'),
      iconClassName: colors.zinc[200],
      bgClassName: colors.zinc[800],
    },
    {
      icon: Target,
      title: t('makingAKill'),
      description: t('makingAKillDescription'),
      iconClassName: colors.red[200],
      bgClassName: colors.red[800],
    },
    {
      icon: Shield,
      title: t('stayingAlive'),
      description: t('stayingAliveDescription'),
      iconClassName: colors.blue[200],
      bgClassName: colors.blue[800],
    },
    {
      icon: Book,
      title: t('wordRules'),
      description: [
        t('wordRulesDescription.0'),
        t('wordRulesDescription.1'),
        t('wordRulesDescription.2'),
      ],
      iconClassName: colors.purple[200],
      bgClassName: colors.purple[800],
      isList: true,
    },
    {
      icon: MessageSquare,
      title: t('fairPlay'),
      description: t('fairPlayDescription'),
      iconClassName: colors.green[200],
      bgClassName: colors.green[800],
    },
    {
      icon: Crown,
      title: t('winningLib'),
      description: t('winningLibDescription'),
      iconClassName: colors.yellow[200],
      bgClassName: colors.yellow[800],
    },
  ];
};
