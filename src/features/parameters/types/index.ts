/**
 * Parameter Types
 * 
 * Type definitions untuk parameter management
 * 
 * @author Chandra Budi Wijaya
 * @version 1.0.0
 */

export interface Parameter {
  id: number;
  param_key: string;
  param_value: string;
  description?: string;
  group_name?: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ParameterFormData {
  param_value: string;
  description: string;
  status: boolean;
}

export interface ParameterFilters {
  group: string;
  status: string;
  search: string;
}