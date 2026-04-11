import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ProjectListLayer from "../components/ProjectListLayer";


const ProjectListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Projects List" />

        {/* UsersListLayer */}
        <ProjectListLayer />

      </MasterLayout>

    </>
  );
};

export default ProjectListPage; 
