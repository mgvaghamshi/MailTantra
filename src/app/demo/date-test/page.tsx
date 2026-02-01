import { extractDateOnly } from '@/lib/datetime-utils';

export default function DateFormatTestPage() {
  const testDates = [
    '2025-08-24',
    '2025-08-24T15:30:00Z',
    '2025-08-24T15:30:00',
    new Date('2025-08-24').toISOString(),
    new Date('2025-08-24')
  ];

  const handleTest = () => {
    console.log('=== Date Format Test ===');
    testDates.forEach((date, index) => {
      const result = extractDateOnly(date);
      console.log(`Test ${index + 1}:`, {
        input: date,
        type: typeof date,
        output: result
      });
    });
    
    // Test the validation payload
    const mockConfig = {
      start_date: '2025-08-24T15:30:00Z',
      end_date: '2025-09-24T15:30:00Z',
      frequency: 'weekly',
      interval: 1,
      time: '10:00',
      timezone: 'America/New_York'
    };
    
    const payload = {
      frequency: mockConfig.frequency,
      interval: mockConfig.interval,
      time: mockConfig.time,
      timezone: mockConfig.timezone,
      start_date: extractDateOnly(mockConfig.start_date),
      end_date: extractDateOnly(mockConfig.end_date)
    };
    
    console.log('Mock validation payload:', payload);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Date Format Test</h1>
      <button 
        onClick={handleTest}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Date Formats (Check Console)
      </button>
      <div className="mt-4 text-sm text-gray-600">
        Click the button and check the browser console for test results.
      </div>
    </div>
  );
}
