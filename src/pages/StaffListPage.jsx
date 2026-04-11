import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StaffsListLayer from "../components/StaffListLayer";


const StaffListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Users Grid" />

        {/* UsersListLayer */}
        <StaffsListLayer />

      </MasterLayout>

    </>
  );
};

export default StaffListPage; 
