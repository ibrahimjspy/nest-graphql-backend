export interface AttributeDetailType {
  name: string;
  id: string;
  type: string;
  inputType: string;
  metadata: Array<{ key: string; value: string }> | [];
}
