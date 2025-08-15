import Heading from '@/components/ui/Heading';
export default function ErrorRoutePage() {
  return (
    <div className="p-8">
      <Heading title="Error" />
      <p className="mt-4 text-gray-600">
        This is a generic error page. Internal errors will show a richer boundary.
      </p>
    </div>
  );
}
