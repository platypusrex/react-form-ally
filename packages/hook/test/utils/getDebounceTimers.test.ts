import { getDebounceTimers } from "../../src/utils";

describe('debounce', () => {
  it('should output equal in/out values if number is provided as input', () => {
    const result = getDebounceTimers(500);
    expect(result).toEqual({ in: 500, out: 500 });
  });

  it('should output same input if both in/out values are provided as input', () => {
    const result = getDebounceTimers({ in: 500, out: 500 });
    expect(result).toEqual({ in: 500, out: 500 });
  });
});
