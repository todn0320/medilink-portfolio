import React from "react";
import { Outlet} from "react-router-dom";
import "./main.css";

const Main = () => {
  return (
        <>
          <main className="main-content">
            <Outlet />
          </main>
        </>

  );
};

export default Main;
