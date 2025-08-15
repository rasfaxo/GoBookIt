import Heading from '@/components/ui/Heading';
export default function NotFound() {
  return (
    <div className="p-8">
      <Heading title="Not Found" />
      <p className="mt-4 text-gray-600">The page you're looking for does not exist.</p>
    </div>
  );
}
