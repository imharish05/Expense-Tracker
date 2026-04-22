import React from "react";
import UsersListLayer from "../components/UsersListLayer";
import Breadcrumb from "../components/Breadcrumb";


const UsersListPage = () => {
  return (
  <>

  <Breadcrumb title={"Customer List"}/>
  
  <UsersListLayer />
  </>
)
};

export default UsersListPage;
