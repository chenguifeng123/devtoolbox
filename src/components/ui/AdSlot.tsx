export default function AdSlot({ position }: { position: string }) {
  return (
    <div className="w-full my-6">
      <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Ad Space — {position}
        </p>
      </div>
    </div>
  );
}
