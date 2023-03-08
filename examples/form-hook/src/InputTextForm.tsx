import * as React from 'react';
import { TextField } from './components/TextField';

export const InputTestForm: React.FC = () => {
  const handleOnChange = (e: any) => {
    console.log(e.target.type);
    console.log(e.target.value);
    console.log(e.target.files);
    console.log(e.target.checked);
  };

  return (
    <form>
      <TextField id="tel-input" label="Tel Input" name="tel" type="tel" onChange={handleOnChange} />
      <TextField id="url-input" label="URL Input" name="url" type="url" onChange={handleOnChange} />
      <TextField
        id="number-input"
        label="Number Input"
        name="number"
        type="number"
        onChange={handleOnChange}
      />
      <div className="form-field">
        <label className="label" htmlFor="range-input">
          Range Input
        </label>
        <input id="range-input" type="range" min={0} max={10} onChange={handleOnChange} />
      </div>
      <div className="form-field">
        <label className="label" htmlFor="checkbox-input">
          Checkbox Input
        </label>
        <input id="checkbox-input" type="checkbox" onChange={handleOnChange} />
      </div>
      <div className="form-field">
        <label className="label" htmlFor="radio-input-1">
          Radio Input
        </label>
        <input
          name="radio-input"
          id="radio-input-1"
          type="radio"
          value="radio-value-1"
          onChange={handleOnChange}
        />
      </div>
      <div className="form-field">
        <label className="label" htmlFor="radio-input-2">
          Radio Input
        </label>
        <input
          name="radio-input"
          id="radio-input-2"
          type="radio"
          value="radio-value-2"
          onChange={handleOnChange}
        />
      </div>
      <div className="form-field">
        <label className="label" htmlFor="date-input">
          Date Input
        </label>
        <input id="date-input" type="date" onChange={handleOnChange} />
      </div>
      <div className="form-field">
        <label className="label" htmlFor="datetime-input">
          DateTime Input
        </label>
        <input id="datetime-input" type="datetime-local" onChange={handleOnChange} />
      </div>
      <div className="form-field">
        <label className="label" htmlFor="month-input">
          Month Input
        </label>
        <input id="month-input" type="month" onChange={handleOnChange} />
      </div>
      <div className="form-field">
        <label className="label" htmlFor="week-input">
          Week Input
        </label>
        <input id="week-input" type="week" onChange={handleOnChange} />
      </div>
      <div className="form-field">
        <label className="label" htmlFor="time-input">
          Time Input
        </label>
        <input id="time-input" type="time" onChange={handleOnChange} />
      </div>
      <div className="form-field">
        <label className="label" htmlFor="color-input">
          Color Input
        </label>
        <input id="color-input" type="color" onChange={handleOnChange} />
      </div>
      <div className="form-field">
        <label className="label" htmlFor="file-input">
          File Input
        </label>
        <input id="file-input" type="file" onChange={handleOnChange} />
      </div>
    </form>
  );
};
