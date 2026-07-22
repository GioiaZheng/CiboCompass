const DEFAULT_API_BASE_URL = 'http://localhost:4000/v1';

function resolveApiBaseUrl(configuredUrl) {
  const apiBaseUrl = configuredUrl?.trim() || DEFAULT_API_BASE_URL;
  return apiBaseUrl.replace(/\/+$/, '');
}

module.exports = {
  DEFAULT_API_BASE_URL,
  resolveApiBaseUrl,
};
