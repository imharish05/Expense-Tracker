import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageOne from "./pages/HomePageOne";
import EmailPage from "./pages/EmailPage";
import AddUserPage from "./pages/AddUserPage";
import AssignRolePage from "./pages/AssignRolePage";

import CalendarMainPage from "./pages/CalendarMainPage";
import CompanyPage from "./pages/CompanyPage";

import ErrorPage from "./pages/ErrorPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";


import InvoiceAddPage from "./pages/InvoiceAddPage";
import InvoiceEditPage from "./pages/InvoiceEditPage";
import InvoiceListPage from "./pages/InvoiceListPage";
import InvoicePreviewPage from "./pages/InvoicePreviewPage";



import NotificationPage from "./pages/NotificationPage";



import RoleAccessPage from "./pages/RoleAccessPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";



import UsersListPage from "./pages/UsersListPage";
import ViewDetailsPage from "./pages/ViewDetailsPage";
import ViewProfilePage from "./pages/ViewProfilePage";
import RouteScrollToTop from "./helper/RouteScrollToTop";


import DocumentUpload from "./pages/DocumentUpload";
import ReportPage from "./pages/ReportPage";
import ProjectListPage from "./pages/ProjectListPage";
import EditUserPageList from "./pages/EditUserListPage";
import SingleProjectPage from "./pages/SingleProjectPage";
import AddProjectPage from "./pages/AddProjectPage";
import AddStaffPage from "./pages/AddStaffPage";
import EditProjectPage from "./pages/EditProjectPage";
import StaffListPage from "./pages/StaffListPage";
import EditStaffListPage from "./pages/EditStaffListPage";

function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <Routes>
        <Route exact path='/' element={<HomePageOne />} />

        {/* SL */}
        
        <Route exact path='/assign-role' element={<AssignRolePage />} />
    
        <Route exact path='/calendar-main' element={<CalendarMainPage />} />
        <Route exact path='/calendar' element={<CalendarMainPage />} />
   

        
        <Route exact path='/company' element={<CompanyPage />} />
        
    
        <Route exact path='/email' element={<EmailPage />} />
        <Route exact path='/forgot-password' element={<ForgotPasswordPage />} />
    

        <Route exact path='/invoice-add' element={<InvoiceAddPage />} />
        <Route exact path='/invoice-edit' element={<InvoiceEditPage />} />
        <Route exact path='/invoice-list' element={<InvoiceListPage />} />
        <Route exact path='/invoice-preview' element={<InvoicePreviewPage />} />

        
        
        <Route exact path='/notification' element={<NotificationPage />} />

        
        <Route exact path='/role-access' element={<RoleAccessPage />} />
        <Route exact path='/sign-in' element={<SignInPage />} />
        <Route exact path='/sign-up' element={<SignUpPage />} />
     
      
      {/* Projects  */}
        <Route exact path='/projects-list' element={<ProjectListPage />} />
        <Route exact path='/projects/:id' element={<SingleProjectPage />} />
        <Route exact path='/add-projects' element={<AddProjectPage />} />
        <Route exact path='/edit-project/:id' element={<EditProjectPage />} />
      



      {/* UserList */}
      <Route exact path='/add-customer' element={<AddUserPage />} />
        <Route exact path='/customers-list' element={<UsersListPage />} />
        <Route exact path='/edit-customer/:id' element={<EditUserPageList />} />
        <Route exact path='/view-details' element={<ViewDetailsPage />} />
        <Route exact path='/view-profile' element={<ViewProfilePage />} />

{/* Staff List */}
        <Route exact path='/add-staff' element={<AddStaffPage />} />
        <Route exact path='/staff-list' element={<StaffListPage />} />
        <Route exact path='/edit-staff/:id' element={<EditStaffListPage />} />


        <Route exact path='*' element={<ErrorPage />} />


        <Route path="/documents" element = {<DocumentUpload/>}/>
        <Route path="/reports" element = {<ReportPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
