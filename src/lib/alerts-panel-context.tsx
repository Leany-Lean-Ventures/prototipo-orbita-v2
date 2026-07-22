import * as React from "react";

interface AlertsPanelContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
}

const AlertsPanelContext = React.createContext<
  AlertsPanelContextValue | undefined
>(undefined);

/**
 * Estado do painel de alertas (Sheet), levantado para fora do AppHeader
 * para que qualquer página (ex.: o KPI "Alertas críticos" do Dashboard)
 * também possa abri-lo, sem duplicar o Sheet nem prop-drill via Outlet.
 */
export function AlertsPanelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const value = React.useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      setOpen: setIsOpen,
    }),
    [isOpen]
  );

  return (
    <AlertsPanelContext.Provider value={value}>
      {children}
    </AlertsPanelContext.Provider>
  );
}

export function useAlertsPanel() {
  const context = React.useContext(AlertsPanelContext);
  if (!context) {
    throw new Error(
      "useAlertsPanel deve ser usado dentro de <AlertsPanelProvider>"
    );
  }
  return context;
}
