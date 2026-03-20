// Dynamic import to avoid SSR crashes - @stacks/connect accesses window at module level
export async function getUserAddress(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  try {
    const { AppConfig, UserSession } = await import('@stacks/connect');
    const appConfig = new AppConfig(['store_write', 'publish_data']);
    const userSession = new UserSession({ appConfig });
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      return userData.profile.stxAddress.mainnet;
    }
  } catch {
    // Module not available or not signed in
  }
  return null;
}
