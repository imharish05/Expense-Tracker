import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddStaffLayer from "../components/AddStaffLayer";


const AddStaffStage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add User" />

        {/* AddStaffLayer */}
        <AddStaffLayer />

      </MasterLayout>
    </>
  );
};

export default AddStaffStage;
