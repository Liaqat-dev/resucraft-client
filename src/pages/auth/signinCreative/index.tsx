import { NextPageWithLayout } from "@dtos/layout";
import Login from "@views/auth/signIn/signinCreative";
import React, { useEffect } from "react";

const SignInCreativePage: NextPageWithLayout = () => {
  useEffect(() => {
    document.title = "sign in | Domiex - React TS Admin & Dashboard Template";
  }, []);

  return (
    <React.Fragment>
      <Login />
    </React.Fragment>
  );
};

export default SignInCreativePage;
