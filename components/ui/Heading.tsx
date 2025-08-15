import { memo } from 'react';

interface HeadingProps {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
}

const Heading = ({ title, subtitle, rightSlot }: HeadingProps) => {
  return (
    <header className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-800 flex items-center gap-3">
            <span className="inline-block w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-300 rounded" />
            <span>{title}</span>
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-blue-600 max-w-2xl leading-relaxed">{subtitle}</p>
          )}
        </div>
        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
    </header>
  );
};
export default memo(Heading);
