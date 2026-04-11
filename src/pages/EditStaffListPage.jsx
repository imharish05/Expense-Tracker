import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditStaffLayer from "../components/EditStaffLayer";


const EditStaffListPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Staff" />

        {/* AddUserLayer */}
        <EditStaffLayer />

      </MasterLayout>
    </>
  );
};

export default EditStaffListPage;
