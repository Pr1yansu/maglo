import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type ConfirmOptions = {
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  // Visual intent for the confirm button
  intent?:
    | "default"
    | "destructive"
    | "secondary"
    | "outline"
    | "ghost"
    | "link";
  // Allow passing any custom footer if caller wants full control
  footer?: React.ReactNode;
};

/**
 * useConfirm hook
 *
 * Usage:
 * const { ConfirmDialog, confirm, withConfirm } = useConfirm();
 * // Render once in your component tree
 * <ConfirmDialog />
 *
 * // Ask for confirmation imperatively
 * const ok = await confirm({ title: "Delete?", description: "This cannot be undone." });
 * if (ok) await doSomethingAsync();
 *
 * // Or wrap any handler
 * const onDelete = withConfirm(async () => await doSomethingAsync(), { intent: "destructive" });
 * <Button onClick={onDelete}>Delete</Button>
 */
export function useConfirm(defaults?: ConfirmOptions) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<ConfirmOptions | undefined>();
  const resolverRef = React.useRef<((ok: boolean) => void) | null>(null);

  // Ensure we resolve promises if dialog is closed by outside click/escape
  const handleOpenChange = React.useCallback((next: boolean) => {
    setOpen(next);
    if (!next && resolverRef.current) {
      // If closed without explicit confirm, treat as cancel
      resolverRef.current(false);
      resolverRef.current = null;
      setOptions(undefined);
    }
  }, []);

  const confirm = React.useCallback(
    (opts?: ConfirmOptions) => {
      // If a confirmation is already open, cancel it and open a new one
      if (resolverRef.current) {
        // Resolve previous as cancelled
        resolverRef.current(false);
        resolverRef.current = null;
      }

      setOptions({
        title: "Are you sure?",
        description: undefined,
        confirmText: "Yes",
        cancelText: "Cancel",
        intent: "default",
        ...(defaults || {}),
        ...(opts || {}),
      });

      setOpen(true);

      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
      });
    },
    [defaults]
  );

  const withConfirm = React.useCallback(
    <A extends any[], R>(
      fn: (...args: A) => Promise<R> | R,
      opts?: ConfirmOptions
    ) => {
      return async (...args: A) => {
        const ok = await confirm(opts);
        if (!ok) return undefined as unknown as R;
        return await fn(...args);
      };
    },
    [confirm]
  );

  const onConfirmClick = React.useCallback(() => {
    setOpen(false);
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
      setOptions(undefined);
    }
  }, []);

  const onCancelClick = React.useCallback(() => {
    setOpen(false);
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
      setOptions(undefined);
    }
  }, []);

  const ConfirmDialog = React.useCallback(() => {
    const o = options || {};
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{o.title || "Are you sure?"}</DialogTitle>
            {o.description ? (
              <DialogDescription>{o.description}</DialogDescription>
            ) : null}
          </DialogHeader>

          <DialogFooter>
            {o.footer ? (
              o.footer
            ) : (
              <>
                <Button variant="outline" onClick={onCancelClick}>
                  {o.cancelText || "Cancel"}
                </Button>
                <Button
                  variant={o.intent || "default"}
                  onClick={onConfirmClick}
                >
                  {o.confirmText || "Yes"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }, [open, options, handleOpenChange, onCancelClick, onConfirmClick]);

  // Resolve any pending promise on unmount
  React.useEffect(() => {
    return () => {
      if (resolverRef.current) {
        resolverRef.current(false);
        resolverRef.current = null;
      }
    };
  }, []);

  return { ConfirmDialog, confirm, withConfirm, isOpen: open } as const;
}

export default useConfirm;
