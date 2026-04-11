import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SingleProjectLayer from "../components/SingleProjectLayer";


const SingleProjectPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Project Details" />

        {/* UsersListLayer */}
        <SingleProjectLayer />

      </MasterLayout>

    </>
  );
};

export default SingleProjectPage; 
