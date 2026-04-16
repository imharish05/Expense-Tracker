import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  staffs: [
    {
      id: 1,
      name: "Harish Kumar",
      address: "12, MG Road, T. Nagar, Chennai, Tamil Nadu - 600017",
      phone: "9876543201",
      projects: [101, 102],
      email: "harish.kumar@example.com",
      password: "hashed_password_1",
      role: "admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Sam Wilson",
      address: "45, Anna Salai, Nungambakkam, Chennai - 600034",
      phone: "9876543202",
      projects: [103],
      email: "sam.wilson@example.com",
      password: "hashed_password_2",
      role: "staff",
      status: "Active",
    },
    {
      id: 3,
      name: "Priya Sharma",
      address: "78, Brigade Road, Bengaluru - 560001",
      phone: "9876543203",
      projects: [],
      email: "priya.sharma@example.com",
      password: "hashed_password_3",
      role: "designer",
      status: "Active",
    },
    {
      id: 4,
      name: "Arjun Reddy",
      address: "23, Banjara Hills, Hyderabad - 500034",
      phone: "9876543204",
      projects: [104, 105],
      email: "arjun.reddy@example.com",
      password: "hashed_password_4",
      role: "staff",
      status: "Inactive",
    },
    {
      id: 5,
      name: "Meera Nair",
      address: "56, Marine Drive, Kochi - 682031",
      phone: "9876543205",
      projects: [],
      email: "meera.nair@example.com",
      password: "hashed_password_5",
      role: "designer",
      status: "Active",
    },
    {
      id: 6,
      name: "Rahul Verma",
      address: "90, Connaught Place, New Delhi - 110001",
      phone: "9876543206",
      projects: [106],
      email: "rahul.verma@example.com",
      password: "hashed_password_6",
      role: "admin",
      status: "Active",
    },
    {
      id: 7,
      name: "Karthik Raj",
      address: "15, RS Puram, Coimbatore - 641002",
      phone: "9876543207",
      projects: [107],
      email: "karthik.raj@example.com",
      password: "hashed_password_7",
      role: "staff",
      status: "Active",
    },
    {
      id: 8,
      name: "Ananya Iyer",
      address: "22, Adyar, Chennai - 600020",
      phone: "9876543208",
      projects: [],
      email: "ananya.iyer@example.com",
      password: "hashed_password_8",
      role: "designer",
      status: "Active",
    },
    {
      id: 9,
      name: "Vikram Singh",
      address: "10, Sector 18, Noida - 201301",
      phone: "9876543209",
      projects: [108, 109],
      email: "vikram.singh@example.com",
      password: "hashed_password_9",
      role: "staff",
      status: "Inactive",
    },
    {
      id: 10,
      name: "Sneha Patel",
      address: "5, Navrangpura, Ahmedabad - 380009",
      phone: "9876543210",
      projects: [],
      email: "sneha.patel@example.com",
      password: "hashed_password_10",
      role: "designer",
      status: "Active",
    },
    {
      id: 11,
      name: "Amit Gupta",
      address: "12, Hazratganj, Lucknow - 226001",
      phone: "9876543211",
      projects: [110],
      email: "amit.gupta@example.com",
      password: "hashed_password_11",
      role: "admin",
      status: "Active",
    },
    {
      id: 12,
      name: "Divya Menon",
      address: "8, Vyttila, Kochi - 682019",
      phone: "9876543212",
      projects: [],
      email: "divya.menon@example.com",
      password: "hashed_password_12",
      role: "designer",
      status: "Active",
    },
    {
      id: 13,
      name: "Rohit Sharma",
      address: "18, Andheri West, Mumbai - 400058",
      phone: "9876543213",
      projects: [111],
      email: "rohit.sharma@example.com",
      password: "hashed_password_13",
      role: "staff",
      status: "Active",
    },
    {
      id: 14,
      name: "Neha Kapoor",
      address: "25, Karol Bagh, New Delhi - 110005",
      phone: "9876543214",
      projects: [],
      email: "neha.kapoor@example.com",
      password: "hashed_password_14",
      role: "designer",
      status: "Inactive",
    },
    {
      id: 15,
      name: "Suresh Babu",
      address: "30, Alwal, Secunderabad - 500010",
      phone: "9876543215",
      projects: [112, 113],
      email: "suresh.babu@example.com",
      password: "hashed_password_15",
      role: "staff",
      status: "Active",
    },
    {
      id: 16,
      name: "Pooja Desai",
      address: "14, Baner, Pune - 411045",
      phone: "9876543216",
      projects: [],
      email: "pooja.desai@example.com",
      password: "hashed_password_16",
      role: "designer",
      status: "Active",
    },
    {
      id: 17,
      name: "Manoj Kumar",
      address: "7, Kankarbagh, Patna - 800020",
      phone: "9876543217",
      projects: [114],
      email: "manoj.kumar@example.com",
      password: "hashed_password_17",
      role: "staff",
      status: "Inactive",
    },
    {
      id: 18,
      name: "Lakshmi Narayanan",
      address: "9, Mylapore, Chennai - 600004",
      phone: "9876543218",
      projects: [],
      email: "lakshmi.narayanan@example.com",
      password: "hashed_password_18",
      role: "admin",
      status: "Active",
    },
    {
      id: 19,
      name: "Kiran Shetty",
      address: "11, Udupi - 576101",
      phone: "9876543219",
      projects: [115],
      email: "kiran.shetty@example.com",
      password: "hashed_password_19",
      role: "staff",
      status: "Active",
    },
    {
      id: 20,
      name: "Nisha Verma",
      address: "16, Indirapuram, Ghaziabad - 201014",
      phone: "9876543220",
      projects: [],
      email: "nisha.verma@example.com",
      password: "hashed_password_20",
      role: "designer",
      status: "Active",
    },
    {
      id: 21,
      name: "Ravi Chandran",
      address: "21, Tambaram, Chennai - 600045",
      phone: "9876543221",
      projects: [116],
      email: "ravi.chandran@example.com",
      password: "hashed_password_21",
      role: "staff",
      status: "Active",
    },
    {
      id: 22,
      name: "Geetha Krishnan",
      address: "3, Thrissur - 680001",
      phone: "9876543222",
      projects: [],
      email: "geetha.krishnan@example.com",
      password: "hashed_password_22",
      role: "designer",
      status: "Inactive",
    },
    {
      id: 23,
      name: "Imran Khan",
      address: "27, Bhopal - 462001",
      phone: "9876543223",
      projects: [117],
      email: "imran.khan@example.com",
      password: "hashed_password_23",
      role: "staff",
      status: "Active",
    },
    {
      id: 24,
      name: "Asha Rani",
      address: "19, Jaipur - 302001",
      phone: "9876543224",
      projects: [],
      email: "asha.rani@example.com",
      password: "hashed_password_24",
      role: "designer",
      status: "Active",
    },
    {
      id: 25,
      name: "Vivek Menon",
      address: "6, Trivandrum - 695001",
      phone: "9876543225",
      projects: [118, 119],
      email: "vivek.menon@example.com",
      password: "hashed_password_25",
      role: "admin",
      status: "Active",
    },
  ],
};

const staffSlice = createSlice({
    name : "Staffs",
    initialState,
    reducers : {
        allStaffs : (state,action) => {
            state.staffs = action.payload;
        },
        addStaff : (state,action) => {
            state.staffs.push(action.payload)
        },
        updateStaff : (state,action) => {
            const index = state.staffs.findIndex(
                (c) => String(c.id) === String(action.payload.id)
            );
            if(index !== -1){
                state.staffs[index] = action.payload;
            }
        },
        deleteStaff : (state,action) => {
            state.staffs = state.staffs.filter(
                (c) => String(c.id) !== String(action.payload)
            )
        },
        assignProjectToStaff: (state, action) => {
            const { staffId, projectId } = action.payload;

            const staff = state.staffs.find((s) => String(s.id) === String(staffId));

            if (staff) {
                if (!staff.projects) staff.projects = [];
                if (!staff.projects.includes(projectId)) staff.projects.push(projectId);
            }
        },
        unAssignProjectFromStaff : (state,action) => {
            const {staffId,projectId} = action.payload;

            const staff = state.staffs.find((s) =>String(s.id) === String(staffId))

            if(staff && staff.projects){
                staff.projects = staff.projects.filter((p) => String(p.id) !== String(projectId))
            }
        }
    }
})


export const {addStaff,updateStaff,deleteStaff,allStaffs,assignProjectToStaff,unAssignProjectFromStaff} = staffSlice.actions;

export default staffSlice.reducer;