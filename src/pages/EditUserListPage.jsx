import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditUserLayer from "../components/EditUserLayer";


const EditUserPageList = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit User" />

        {/* AddUserLayer */}
        <EditUserLayer />

      </MasterLayout>
    </>
  );
};

export default EditUserPageList;
