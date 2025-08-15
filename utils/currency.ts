export function formatCurrency(
  value: number | undefined | null,
  options?: {
    currency?: string;
    locale?: string;
    maximumFractionDigits?: number;
  }
): string {
  const num = typeof value === 'number' && !isNaN(value) ? value : 0;
  const { currency = 'USD', locale = 'en-US', maximumFractionDigits = 2 } = options || {};
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits,
  }).format(num);
}

export function formatUSD(value: number | undefined | null) {
  return formatCurrency(value, { currency: 'USD', locale: 'en-US', maximumFractionDigits: 2 });
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const formatIDR = formatUSD;
