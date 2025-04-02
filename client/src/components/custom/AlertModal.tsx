"use client";
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
import { useSpotifySession } from "@/hooks/SpotifySessionProvider";
import { useEffect, useState } from "react";

type AlertModalProps = {
  title?: string;
  description?: string;
};

export function AlertModal({
  title = "Please login with your Spotify.",
  description = "Please login with your Spotify to allow users to send spotify songs to the queue.",
}: AlertModalProps) {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { session, fetching, isAuthenticated } = useSpotifySession();
  useEffect(() => {
    // Safe localStorage access
    const stored = localStorage.getItem("showSpotifyAlertModal");
    setShowModal(stored !== "false"); // You can adjust default fallback logic
  }, []);

  useEffect(() => {
    if (!fetching && !isAuthenticated && showModal) {
      setOpen(true);
    }
  }, [session]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title} </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
