export const zoneRoutingMap: Record<string, { slackWebhook: string; salesforceQueue: string }> = {
    'Zone 5': {
      slackWebhook: 'https://hooks.slack.com/services/XXX',
      salesforceQueue: 'Zone 5 Response Team'
    },
    'Zone 6': {
      slackWebhook: 'https://hooks.slack.com/services/YYY',
      salesforceQueue: 'Zone 6 Response Team'
    }
  };
  
  
  export function getZoneByCoords(lat: number, lng: number): string {
    if (lat >= 40.007 && lat <= 40.009 && lng >= -83.027 && lng <= -83.025) {
      return 'Zone 5';
    }
    if (lat >= 40.002 && lat <= 40.004 && lng >= -83.030 && lng <= -83.028) {
      return 'Zone 6';
    }
    return 'Unmapped';
  }
  