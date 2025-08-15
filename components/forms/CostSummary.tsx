import { memo } from 'react';
import { STRINGS } from '@/constants/strings';
import { formatUSD } from '@/utils/currency';

interface CostSummaryProps {
  labelId: string;
  hours: number | null;
  pricePerHour: number;
}

const CostSummary = ({ labelId, hours, pricePerHour }: CostSummaryProps) => (
  <div
    className="rounded-md border border-blue-100 bg-white/70 dark:bg-blue-900/40 dark:border-blue-800 px-4 py-3 text-sm flex items-center justify-between"
    aria-live="polite"
    aria-atomic="true"
  >
    <span id={labelId} className="text-blue-700 dark:text-blue-200 font-medium">
      {STRINGS.rooms.estimatedCost}
    </span>
    <span className="font-semibold text-blue-800 dark:text-blue-100">
      {hours !== null ? `${formatUSD(pricePerHour * hours)} (${hours}h)` : '—'}
    </span>
  </div>
);

export default memo(CostSummary);
