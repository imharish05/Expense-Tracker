import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditProjectLayer from "../components/EditProjectLayer";


const EditProjectPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Project" />

        {/* AddUserLayer */}
        <EditProjectLayer />

      </MasterLayout>
    </>
  );
};

export default EditProjectPage;
