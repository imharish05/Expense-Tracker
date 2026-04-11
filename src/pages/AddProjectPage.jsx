import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddProjectLayer from "../components/AddProjectLayer";


const AddProjectPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Project" />

        {/* AddUserLayer */}
        <AddProjectLayer />

      </MasterLayout>
    </>
  );
};

export default AddProjectPage;
