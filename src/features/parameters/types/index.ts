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
  description?: string;
  status: boolean;
}

export interface NewParameterFormData {
  param_key: string;
  param_value: string;
  description?: string;
  group_name?: string;
  status: boolean;
}

export type StatusFilter = '' | 'true' | 'false';

export interface ParameterFilters {
  group: string;
  status: StatusFilter;
  search: string;
}

export interface EditParameterModalProps {
  isOpen: boolean;
  onClose: () => void;
  parameter: Parameter | null;
  onUpdate: () => void;
}
