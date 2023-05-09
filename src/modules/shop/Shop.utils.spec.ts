import { getFieldValues, validateArray } from './Shop.utils';

describe('Shop utility tests', () => {
  it('elements are correctly getting validated whether they are string or array', () => {
    const response = validateArray([{ bundleId: '123' }]);
    expect(response).toBeDefined();
    expect(response).toStrictEqual([{ bundleId: '123' }]);
    const transformedResponse = validateArray({ bundleId: '123' });
    expect(transformedResponse).toBeDefined();
    expect(transformedResponse).toStrictEqual([{ bundleId: '123' }]);
  });

  it('field values are correctly getting extracted', () => {
    const fieldValues = getFieldValues(
      [{ name: 'test', values: ['value'] }],
      'test',
    );
    expect(fieldValues).toBeDefined();
    expect(fieldValues).toStrictEqual(['value']);

    const fieldValuesEmpty = getFieldValues(
      [{ name: 'test2', values: ['value'] }],
      'test',
    );
    expect(fieldValuesEmpty).toBeDefined();
    expect(fieldValuesEmpty).toStrictEqual([]);
  });

  it('field values are correctly getting extracted', () => {
    const fieldValues = getFieldValues(
      [{ name: 'test', values: ['value'] }],
      'test',
    );
    expect(fieldValues).toBeDefined();
    expect(fieldValues).toStrictEqual(['value']);

    const fieldValuesEmpty = getFieldValues(
      [{ name: 'test2', values: ['value'] }],
      'test',
    );
    expect(fieldValuesEmpty).toBeDefined();
    expect(fieldValuesEmpty).toStrictEqual([]);
  });
});
