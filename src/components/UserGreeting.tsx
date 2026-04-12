'use client';
import { useUserGreeting } from '@/hooks/useUserGreeting';
import { NamePrompt } from './NamePrompt';
import { WelcomeToast } from './WelcomeToast';

export function UserGreeting() {
  const {
    userName,
    showNamePrompt,
    showWelcomeBack,
    visitCount,
    isReady,
    saveName,
    dismissPrompt,
    dismissWelcome,
    getPersonalizedMessage,
  } = useUserGreeting();

  // Never render on server — avoids hydration mismatch
  if (!isReady) return null;

  return (
    <>
      {showNamePrompt && (
        <NamePrompt onSave={saveName} onDismiss={dismissPrompt} />
      )}
      {showWelcomeBack && userName && (
        <WelcomeToast
          name={userName}
          message={getPersonalizedMessage(userName, visitCount)}
          onDismiss={dismissWelcome}
        />
      )}
    </>
  );
}
