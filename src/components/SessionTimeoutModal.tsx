import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SessionTimeoutModalProps {
  open: boolean;
  onRenew: () => void;
  onLogout: () => void;
}

export function SessionTimeoutModal({ open, onRenew, onLogout }: SessionTimeoutModalProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-gradient-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Sessão expirando</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Sua sessão está prestes a expirar por inatividade. Deseja continuar conectada?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onLogout}>
            Sair
          </AlertDialogCancel>
          <AlertDialogAction onClick={onRenew} className="bg-gradient-primary">
            Continuar conectada
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
