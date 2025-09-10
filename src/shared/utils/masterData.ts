/**
 * Master Data Utilities
 * Helper functions untuk menangani data master dari backend
 */

export interface MasterDataItem {
  value: string;
  label: string;
}

export interface MasterDataResponse {
  data: MasterDataItem[];
}

/**
 * Transform master data API response ke format dropdown
 */
export function transformMasterDataToDropdown(
  response: MasterDataResponse
): Array<{value: string, label: string}> {
  return response.data || [];
}

/**
 * Transform master data array ke string array untuk backward compatibility
 */
export function transformMasterDataToStringArray(
  response: MasterDataResponse
): string[] {
  return response.data?.map(item => item.value) || [];
}

/**
 * Convert string array ke dropdown format dengan label mapping
 */
export function stringArrayToDropdown(
  values: string[],
  labelMap?: Record<string, string>
): Array<{value: string, label: string}> {
  return values.map(value => ({
    value,
    label: labelMap?.[value] || value
  }));
}

/**
 * Default label mapping untuk wilayah
 */
export const wilayahLabelMap: Record<string, string> = {
  'WIL1': 'Wilayah 1',
  'WIL2': 'Wilayah 2',
  'WIL3': 'Wilayah 3',
  'WIL4': 'Wilayah 4',
};

/**
 * Default label mapping untuk plantation groups
 */
export const plantationGroupLabelMap: Record<string, string> = {
  'PG1': 'Plantation Group 1',
  'PG2': 'Plantation Group 2',
  'PG3': 'Plantation Group 3',
  'PG4': 'Plantation Group 4',
};
