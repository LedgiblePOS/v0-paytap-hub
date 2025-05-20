
import React from "react";
import { PaymentStatus } from "@/hooks/useTapToPay";
import IdleStatus from "./IdleStatus";
import ConnectingStatus from "./ConnectingStatus";
import WaitingStatus from "./WaitingStatus";
import ProcessingStatus from "./ProcessingStatus";
import SuccessStatus from "./SuccessStatus";
import FailedStatus from "./FailedStatus";
import CancelledStatus from "./CancelledStatus";

interface StatusDisplayProps {
  status: PaymentStatus;
  errorMessage: string;
  onStartPayment: () => void;
  onCancel: () => void;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({
  status,
  errorMessage,
  onStartPayment,
  onCancel,
}) => {
  switch (status) {
    case "idle":
      return <IdleStatus onStartPayment={onStartPayment} />;
    case "connecting":
      return <ConnectingStatus onCancel={onCancel} />;
    case "waiting":
      return <WaitingStatus onCancel={onCancel} />;
    case "processing":
      return <ProcessingStatus />;
    case "success":
      return <SuccessStatus />;
    case "failed":
      return <FailedStatus errorMessage={errorMessage} onRetry={onStartPayment} onCancel={onCancel} />;
    case "cancelled":
      return <CancelledStatus onRetry={onStartPayment} onCancel={onCancel} />;
    default:
      return null;
  }
};

export default StatusDisplay;
