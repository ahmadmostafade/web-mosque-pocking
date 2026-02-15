import { formatCurrency, DonationProgress } from "@/lib/donations";

interface Props {
  progress: DonationProgress;
  showDetails?: boolean;
}

export default function DonationProgressBar({
  progress,
  showDetails = true,
}: Props) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-semibold text-mosque-green-700">
          {formatCurrency(progress.currentAmount)}
        </span>
        <span className="text-gray-500">
          Ziel: {formatCurrency(progress.goalAmount)}
        </span>
      </div>

      <div
        className="w-full bg-gray-200 rounded-full h-5 overflow-hidden"
        role="progressbar"
        aria-valuenow={progress.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Spendenfortschritt: ${progress.percentage}%`}
      >
        <div
          className="bg-mosque-green-500 h-5 rounded-full transition-all duration-700 flex items-center justify-center text-xs text-white font-bold"
          style={{ width: `${Math.max(progress.percentage, 3)}%` }}
        >
          {progress.percentage}%
        </div>
      </div>

      {showDetails && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Noch {formatCurrency(progress.remaining)} benötigt</span>
          <span>
            Aktualisiert:{" "}
            {new Date(progress.lastUpdated).toLocaleDateString("de-DE")}
          </span>
        </div>
      )}
    </div>
  );
}
