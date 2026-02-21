import { formatCurrency, DonationProgress } from "@/lib/donations";

interface Props {
  progress: DonationProgress;
  title?: string;
  showDetails?: boolean;
}

export default function DonationProgressBar({
  progress,
  title,
  showDetails = true,
}: Props) {
  const getDisplayDate = () => {
    try {
      const date = new Date(progress.lastUpdated);
      if (isNaN(date.getTime())) return new Date().toLocaleDateString("de-DE");
      return date.toLocaleDateString("de-DE");
    } catch {
      return new Date().toLocaleDateString("de-DE");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full">
      {title && (
        <h2 className="text-xl font-bold text-mosque-green-700 mb-5">{title}</h2>
      )}

      <div className="flex justify-between items-baseline text-sm mb-2">
        <span className="font-semibold text-mosque-green-700 text-base">
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
          className="bg-mosque-green-500 h-5 rounded-full transition-all duration-700 flex items-center justify-center text-xs text-white font-bold relative overflow-hidden"
          style={{ width: `${Math.max(progress.percentage, 3)}%` }}
        >
          <span className="relative z-10">{progress.percentage}%</span>
          <div className="absolute inset-0 animate-shimmer" />
        </div>
      </div>

      {showDetails && (
        <div className="flex justify-between text-xs text-gray-500 mt-3">
          <span>Noch {formatCurrency(progress.remaining)} benötigt</span>
          <span>Aktualisiert: {getDisplayDate()}</span>
        </div>
      )}
    </div>
  );
}
