
export const getImportanceColor = (rating: number) => {
  if (rating >= 9) return 'bg-red-100 text-red-800 border-red-200';
  if (rating >= 7) return 'bg-orange-100 text-orange-800 border-orange-200';
  if (rating >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (rating >= 3) return 'bg-blue-100 text-blue-800 border-blue-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
};
