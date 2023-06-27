import React from 'react';
import { NavLink, Outlet, Route, Routes } from 'react-router-dom';
import { CustomValidator } from './forms/CustomValidator';
import { DefaultValidator } from './forms/DefaultValidator';
import { ZodValidator } from './forms/ZodValidator';
import { YupValidator } from './forms/YupValidator';
import { CheckboxAndRadio } from './forms/CheckboxAndRadio';
import { StepFormOne } from './forms/StepFormOne';
import { StepFormTwo } from './forms/StepFormTwo';
import './App.css';

const Layout: React.FC = () => (
  <div className="container">
    <div className="button-wrapper space-around">
      <NavLink className="link" to="/">
        Default
      </NavLink>
      <NavLink className="link" to="custom">
        Custom
      </NavLink>
      <NavLink className="link" to="zod">
        Zod
      </NavLink>
      <NavLink className="link" to="yup">
        Yup
      </NavLink>
      <NavLink className="link" to="checkbox-radio">
        Checkbox/Radio
      </NavLink>
      <NavLink className="link" to="step-form-one">
        Step Form
      </NavLink>
    </div>
    <Outlet />
  </div>
);

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DefaultValidator />} />
        <Route path="custom" element={<CustomValidator />} />
        <Route path="zod" element={<ZodValidator />} />
        <Route path="yup" element={<YupValidator />} />
        <Route path="checkbox-radio" element={<CheckboxAndRadio />} />
        <Route path="step-form-one" element={<StepFormOne />} />
        <Route path="step-form-two" element={<StepFormTwo />} />
      </Route>
    </Routes>
  );
};
