import MasterLayout from '../masterLayout/MasterLayout';
// 1. DELETE THIS: import { Breadcrumb } from 'react-bootstrap'
// 2. ADD THIS (Adjust the path to where your custom Breadcrumb file is):
import Breadcrumb from '../components/Breadcrumb'; 
import ReportLayer from '../components/ReportLayer';

const ReportPage = () => {
  return (
    <MasterLayout>
      {/* Now this will correctly receive the "title" prop */}
      <Breadcrumb title="Reports" />
      <ReportLayer />
    </MasterLayout>
  );
};

export default ReportPage;