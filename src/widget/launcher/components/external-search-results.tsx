import ExternalSearchButton from "../buttons/external-search-button";
import configManager from "../../../services/config-manager";
import { launcherLogger as log } from "../../../utils/logger";

export interface ExternalSearchResult {
  providerKey: string;
  providerName: string;
  query: string;
  url: string;
  icon: string;
  index: number;
}

export function parseExternalSearchQuery(searchText: string): { provider?: string; query: string } {
  const trimmedText = searchText.trim();

  // Check for specific provider prefixes (!g, !d, !c)
  const providers = configManager.config.search.externalProviders;
  for (const [key, provider] of Object.entries(providers)) {
    const prefixWithSpace = provider.prefix + " ";
    if (trimmedText.toLowerCase().startsWith(prefixWithSpace)) {
      return {
        provider: key,
        query: trimmedText.substring(prefixWithSpace.length).trim()
      };
    }
  }

  // Check for general search: prefix
  if (trimmedText.toLowerCase().startsWith("search:")) {
    return {
      provider: undefined, // Show all providers
      query: trimmedText.substring(7).trim()
    };
  }

  return { query: trimmedText };
}

export default function getExternalSearchResults(searchText: string): ExternalSearchResult[] {
  const { provider, query } = parseExternalSearchQuery(searchText);

  if (!query) {
    return [];
  }

  const providers = configManager.config.search.externalProviders;
  const results: ExternalSearchResult[] = [];

  if (provider) {
    // Specific provider search
    const providerConfig = providers[provider];
    if (providerConfig) {
      results.push({
        providerKey: provider,
        providerName: providerConfig.name,
        query,
        url: providerConfig.url,
        icon: providerConfig.icon,
        index: 0
      });
    }
  } else {
    // Show all providers (for search: prefix)
    let index = 0;
    for (const [key, providerConfig] of Object.entries(providers)) {
      results.push({
        providerKey: key,
        providerName: providerConfig.name,
        query,
        url: providerConfig.url,
        icon: providerConfig.icon,
        index: index++
      });
    }
  }

  log.debug("External search results", { searchText, provider, query, resultsCount: results.length });

  return results;
}

// Export a function to create the external search button component
export function createExternalSearchButton(result: ExternalSearchResult, props: any) {
  return (
    <ExternalSearchButton
      providerName={result.providerName}
      query={result.query}
      url={result.url}
      icon={result.icon}
      index={result.index}
      {...props}
    />
  );
}
