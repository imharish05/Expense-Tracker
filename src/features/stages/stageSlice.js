import { createSlice,current } from "@reduxjs/toolkit";

const initialState = {
  stage: [
    {
  "projectId": "7a36e31a-0e09-4e60-9619-1a2793d0c223",
  "stages": [
    {
      "id": "1",
      "stage_Name": "Architecture Design",
      "description": "Initial blueprints",
      "amount": 50000,
      "paid": 50000,
      "status": "In Progress"
    },
    {
      "id": "2",
      "stage_Name": "Fabrication",
      "description": "Steel cutting at SKV site",
      "amount": 100000,
      "paid": 0,
      "status": "Pending"
    }
  ]
}
  ],
  loading: false
};

const projectProgressSlice = createSlice({
  name: 'projectProgress',
  initialState,
  reducers: {

    setStages: (state, action) => {
      state.stage = action.payload;
    },

    // Simply pushes the new stage into the current list
// projectProgressSlice.js

// projectProgressSlice.js

addStage: (state, action) => {
  const { projectId, stage } = action.payload;
  const projectProgress = state.stage.find(p => p.projectId === projectId);

  // FIX: Ensure every stage has a unique ID and initialized paid amount
  const newStage = {
    ...stage,
    id: stage.id || stage._id || `temp-${Date.now()}-${Math.random()}`, 
    paid: Number(stage.paid) || 0,
    status: stage.status || "Pending"
  };

  if (projectProgress) {
    projectProgress.stages.push(newStage);
  } else {
    state.stage.push({
      projectId: projectId,
      stages: [newStage]
    });
  }
},

recordStagePayment: (state, action) => {
  const { projectId, stageId, paid } = action.payload;
  const projectProgress = state.stage.find(p => p.projectId === projectId);

  if (projectProgress) {
    // FIX: Look for the specific stage instance
    const stage = projectProgress.stages.find(s => (s.id === stageId || s._id === stageId));
    
    if (stage) {
      const incoming = Number(paid) || 0;
      const currentPaid = Number(stage.paid) || 0;
      const stageGoal = Number(stage.amount) || 0;

      stage.paid = Math.min(stageGoal, currentPaid + incoming);
      stage.status = stage.paid >= stageGoal ? "Completed" : "In Progress";
    }
  }
}
},
});

export const { addStage, recordStagePayment, setStages } = projectProgressSlice.actions;
export default projectProgressSlice.reducer;