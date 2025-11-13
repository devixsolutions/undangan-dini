'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type InvitationContextValue = {
  isOpen: boolean;
  openInvitation: () => void;
};

const InvitationContext = createContext<InvitationContextValue | undefined>(
  undefined,
);

type InvitationProviderProps = {
  children: ReactNode;
};

export function InvitationProvider({ children }: InvitationProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openInvitation = useCallback(() => {
    setIsOpen(true);
  }, []);

  const value = useMemo<InvitationContextValue>(
    () => ({
      isOpen,
      openInvitation,
    }),
    [isOpen, openInvitation],
  );

  return (
    <InvitationContext.Provider value={value}>
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation() {
  const context = useContext(InvitationContext);

  if (!context) {
    throw new Error('useInvitation must be used within an InvitationProvider');
  }

  return context;
}


