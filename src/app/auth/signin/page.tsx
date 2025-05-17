"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import AppInput from "@/components/widget/Form/Input";
import AppButton from "@/components/widget/Form/Button";
import useLoginForm from "@/hooks/forms/useLoginForm.hook";
import ActionResult from "@/components/widget/Form/ActionResultMessage";
import ProcessingLoader from "@/components/common/Loader/ProcessingLoader";

const SignIn: React.FC = () => {
  const { formData, formErrors, processing, onInputDataChange, onFormSubmit } =
    useLoginForm();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      window.location.pathname = "/";
    }
  }, []);

  return (
    <div className=" flex h-screen w-screen items-center justify-center rounded-sm shadow-default  ">
      <div className=" mx-7 w-full border-stroke bg-white shadow-lg  dark:border-strokedark dark:bg-boxdark md:mx-0 md:w-1/2 xl:w-1/3 ">
        <ActionResult />
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <form onSubmit={onFormSubmit}>
            <div className="mb-4">
              <AppInput
                label="Email"
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={onInputDataChange}
              />
              {formErrors.email && (
                <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                  {formErrors.email}
                </p>
              )}
            </div>
            <div className="mb-6">
              <AppInput
                label="Password"
                id="password"
                name="password"
                type="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={onInputDataChange}
              />
              {formErrors.password && (
                <p className="erreur ml-1.5 text-[14px] font-medium text-red">
                  {formErrors.password}
                </p>
              )}
            </div>
            <div className="mb-5">
              {processing ? (
                <ProcessingLoader />
              ) : (
                <AppButton name="Connexion" onClick={() => {}} />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
