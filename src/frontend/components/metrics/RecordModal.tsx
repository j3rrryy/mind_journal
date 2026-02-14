"use client";

import React, { useEffect, useCallback } from "react";
import { MetricsForm } from "./MetricsForm";
import type { Metrics } from "@/types";
import { LoadingDots } from "@/components/common/LoadingDots";

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  initialMetrics?: Metrics;
  onSubmit: (date: string, metrics: Metrics) => Promise<void>;
  isSubmitting?: boolean;
  title: string;
  editLabel?: string;
  addLabel?: string;
}

export const RecordModal = React.memo(function RecordModal({
  isOpen,
  onClose,
  date,
  initialMetrics,
  onSubmit,
  isSubmitting = false,
  title,
  editLabel,
  addLabel,
}: RecordModalProps) {
  const hasRecord = !!initialMetrics;
  const label = hasRecord ? editLabel : addLabel;

  const handleSubmit = useCallback(
    async (metrics: Metrics) => {
      await onSubmit(date, metrics);
      onClose();
    },
    [date, onSubmit, onClose]
  );

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          {label && <p className="mt-1 text-sm text-text-secondary">{date}</p>}
        </div>

        {isSubmitting ? (
          <div className="flex items-center justify-center py-8">
            <LoadingDots size="md" fullPage={false} />
          </div>
        ) : (
          <MetricsForm
            initialMetrics={initialMetrics}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
});
