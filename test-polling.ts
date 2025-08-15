import { emailTrackerAPI } from '@/lib/emailtracker-api';

/**
 * Test script to verify the getCampaign API endpoint
 * Run this in browser console to test the real-time polling functionality
 */

// Test function to manually verify campaign status updates
(window as any).testCampaignPolling = async () => {
  try {
    console.log('Testing campaign polling...');
    
    // Get all campaigns first
    const campaigns = await emailTrackerAPI.getCampaigns();
    console.log('All campaigns:', campaigns);
    
    if (campaigns.length > 0) {
      const firstCampaign = campaigns[0];
      console.log('Testing single campaign fetch for:', firstCampaign.id);
      
      // Test getting a single campaign
      const singleCampaign = await emailTrackerAPI.getCampaign(firstCampaign.id);
      console.log('Single campaign result:', singleCampaign);
      
      // Test status comparison
      console.log('Status comparison:', {
        original: firstCampaign.status,
        fetched: singleCampaign.status,
        areEqual: firstCampaign.status === singleCampaign.status
      });
      
      console.log('✅ Campaign polling test completed successfully!');
      return { campaigns, singleCampaign };
    } else {
      console.log('❌ No campaigns found to test');
      return null;
    }
  } catch (error) {
    console.error('❌ Campaign polling test failed:', error);
    return null;
  }
};

console.log('Campaign polling test function loaded. Run testCampaignPolling() to test.');
