const Package = require('../models/Package');
const Project = require('../models/Project');
const GalleryItem = require('../models/GalleryItem');
const RentalVehicle = require('../models/RentalVehicle');
const config = require('../config/config');

exports.getCounts = async () => {
  const [packages, projects, galleryImages, vehicles] = await Promise.all([
    Package.countDocuments({}),
    Project.countDocuments({}),
    GalleryItem.countDocuments({ mediaType: 'image' }),
    RentalVehicle.countDocuments({}),
  ]);
  return { packages, projects, galleryImages, vehicles };
};

const emptyStorage = (quotaBytes, error) => ({
  usedBytes: 0,
  quotaBytes,
  percent: 0,
  unavailable: true,
  error,
});

exports.getStorage = async () => {
  const { analyticsToken, analyticsEndpoint, accountId, bucket, quotaBytes } = config.r2;
  if (!analyticsToken || !accountId || !bucket) {
    return emptyStorage(quotaBytes, 'R2 analytics is not configured');
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const isDefaultEndpoint = analyticsEndpoint === 'https://api.cloudflare.com/client/v4/graphql';
    const body = isDefaultEndpoint
      ? {
          query: `query R2Storage($accountTag: String!, $bucket: String!, $start: Date!, $end: Date!) {
            viewer {
              accounts(filter: { accountTag: $accountTag }) {
                r2StorageAdaptiveGroups(
                  filter: { bucket: $bucket, date_geq: $start, date_leq: $end }
                  limit: 1
                  orderBy: [datetime_DESC]
                ) {
                  max { bucketSize }
                  datetime
                }
              }
            }
          }`,
          variables: { accountTag: accountId, bucket, start: today, end: today },
        }
      : { accountId, bucket, date: today };

    const response = await fetch(analyticsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${analyticsToken}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Analytics API ${response.status}`);

    const json = await response.json();
    if (Array.isArray(json.errors) && json.errors.length) {
      throw new Error(json.errors[0].message || 'Analytics query failed');
    }

    let usedBytes = 0;
    if (isDefaultEndpoint) {
      const groups = json?.data?.viewer?.accounts?.[0]?.r2StorageAdaptiveGroups || [];
      usedBytes = Number(groups[0]?.max?.bucketSize || 0);
    } else {
      usedBytes = Number(json.usedBytes ?? json.bytes ?? json.result?.usedBytes ?? json.data?.usedBytes ?? 0);
    }
    if (!Number.isFinite(usedBytes) || usedBytes < 0) usedBytes = 0;

    return {
      usedBytes,
      quotaBytes,
      percent: quotaBytes > 0 ? Math.min(100, Math.round((usedBytes / quotaBytes) * 1000) / 10) : 0,
      unavailable: false,
    };
  } catch (error) {
    return emptyStorage(quotaBytes, error instanceof Error ? error.message : 'Could not load R2 storage');
  }
};
