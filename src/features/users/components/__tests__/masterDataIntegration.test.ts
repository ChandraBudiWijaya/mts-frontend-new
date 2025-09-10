// Test file untuk Master Data API Integration
import { describe, it, expect, vi } from 'vitest';
import { masterDataAPI } from '../../../shared/api';
import { 
  transformMasterDataToDropdown, 
  transformMasterDataToStringArray,
  stringArrayToDropdown,
  wilayahLabelMap 
} from '../../../shared/utils/masterData';

// Mock API response
const mockMasterDataResponse = {
  data: [
    { value: 'WIL1', label: 'Wilayah 1' },
    { value: 'WIL2', label: 'Wilayah 2' },
    { value: 'PG1', label: 'Plantation Group 1' },
    { value: 'PG2', label: 'Plantation Group 2' },
  ]
};

describe('Master Data API Integration', () => {
  it('should transform master data response to dropdown format', () => {
    const result = transformMasterDataToDropdown(mockMasterDataResponse);
    expect(result).toEqual([
      { value: 'WIL1', label: 'Wilayah 1' },
      { value: 'WIL2', label: 'Wilayah 2' },
      { value: 'PG1', label: 'Plantation Group 1' },
      { value: 'PG2', label: 'Plantation Group 2' },
    ]);
  });

  it('should transform master data response to string array', () => {
    const result = transformMasterDataToStringArray(mockMasterDataResponse);
    expect(result).toEqual(['WIL1', 'WIL2', 'PG1', 'PG2']);
  });

  it('should convert string array to dropdown with label mapping', () => {
    const stringArray = ['WIL1', 'WIL2'];
    const result = stringArrayToDropdown(stringArray, wilayahLabelMap);
    expect(result).toEqual([
      { value: 'WIL1', label: 'Wilayah 1' },
      { value: 'WIL2', label: 'Wilayah 2' },
    ]);
  });

  it('should handle empty master data response gracefully', () => {
    const emptyResponse = { data: [] };
    const dropdownResult = transformMasterDataToDropdown(emptyResponse);
    const stringResult = transformMasterDataToStringArray(emptyResponse);
    
    expect(dropdownResult).toEqual([]);
    expect(stringResult).toEqual([]);
  });

  it('should use fallback label when no mapping provided', () => {
    const stringArray = ['UNKNOWN_VALUE'];
    const result = stringArrayToDropdown(stringArray);
    expect(result).toEqual([
      { value: 'UNKNOWN_VALUE', label: 'UNKNOWN_VALUE' }
    ]);
  });
});

describe('Master Data API Endpoints', () => {
  it('should have correct endpoint structure', () => {
    expect(typeof masterDataAPI.getWilayah).toBe('function');
    expect(typeof masterDataAPI.getPlantationGroups).toBe('function');
    expect(typeof masterDataAPI.getAll).toBe('function');
    expect(typeof masterDataAPI.getLokasiByWilayah).toBe('function');
    expect(typeof masterDataAPI.getLokasiByPg).toBe('function');
  });
});
