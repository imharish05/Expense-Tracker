import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ProjectReminders from "../components/ProjectRemainders";


const NotificationAlertPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Settings - Notification Alert" />

        {/* NotificationAlertLayer */}
        <ProjectReminders />

      </MasterLayout>

    </>
  );
};

export default NotificationAlertPage; 
