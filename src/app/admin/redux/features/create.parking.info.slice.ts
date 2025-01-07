import Api from "@App/admin/api/Api";
import getApiUrl from "@App/admin/api/ApiUrls";
import { Label } from "@mui/icons-material";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { actions } from "react-table";
import { toast } from "react-toastify";

const create_parking_for_the_project_object = (project_id: any) => {
  return {
    project_id,
    [project_id]: {
      towers: {
      }
    },
  };
};

const create_parking_for_the_project_tower_object = (tower_id: any) => {
  return {
    [tower_id]: {},
  };
};

const create_Basis_of_no_of_eligible_car_parking_object = (
  basis_of_no_of_eligible_car_parking: string
) => {
  return {
    basis_of_no_of_eligible_car_parking,
    [basis_of_no_of_eligible_car_parking]: {},
  };
};

const create_location_object = (
  location: any,
  no_of_parkings: number,
  back_to_back: boolean,
) => {

  return {
    [location]: {
      no_of_parkings,
      back_to_back,
    },
  };
};

interface ParkingInfoState {
  loading: boolean;
  responseData: any;
  message: string;
  parkingDetails: any;
  towers: any;
  flatTypes: any;
  flatSizes: any;
  noOfFloors: any;
  locations: any;
  validations: any;
}

const initialState: ParkingInfoState = {
  loading: false,
  responseData: [],
  message: "",
  parkingDetails: {},
  towers: [],
  flatTypes: [],
  flatSizes: [],
  noOfFloors: "",
  locations: [],
  validations: {}
};

export const getParkingProjects = createAsyncThunk(
  "createParkingInfo/getParkingProjects",
  async (data: any) => {
    const { url_name, params_data } = data;
    return await Api.get(url_name, params_data);
  }
);

export const getParkingProjectTowers = createAsyncThunk(
  "createParkingInfo/getParkingProjectTowers",
  async (data: any) => {
    const { url_name, params_data } = data;
    return await Api.get(url_name, params_data);
  }
);

export const getParkingProjectTowerFloors = createAsyncThunk(
  "createParkingInfo/getParkingProjectTowerFloors",
  async (data: any) => {
    const { url_name, params_data } = data;
    return await Api.get(url_name, params_data);
  }
);

export const getParkingProjectTowerFlatTypes = createAsyncThunk(
  "createParkingInfo/getParkingProjectTowerFlatTypes",
  async (data: any) => {
    const { url_name, params_data } = data;
    return await Api.get(url_name, params_data);
  }
);

export const getParkingProjectTowerFlatSizes = createAsyncThunk(
  "createParkingInfo/getParkingProjectTowerFlatSizes",
  async (data: any) => {
    const { url_name, params_data } = data;
    return await Api.get(url_name, params_data);
  }
);

export const getParkingProjectTowerLocations = createAsyncThunk(
  "createParkingInfo/getParkingProjectTowerLocations",
  async (data: any) => {
    const { url_name, params_data } = data;
    return await Api.get(url_name, params_data);
  }
);

export const getParkingTowerVersions = createAsyncThunk(
  "createParkingInfo/getParkingTowerVersions",
  async (data: any) => {
    const { url_name, params_data } = data;
    return await Api.get(url_name, params_data);
  }
);

export const postParkingRules = createAsyncThunk(
  "createParkingInfo/postParkingRules",
  async (data: any) => {
    const { url_name, body } = data;
    return await Api.post(url_name, body);
  }
);

export const updateParkingRuleInforce = createAsyncThunk(
  "createParkingInfo/updateParkingRuleInforce",
  async (data: any) => {
    const { url_name, body } = data;
    return await Api.post(url_name, body);
  }
);

const createParkingInfoSlice = createSlice({
  name: "createParkingInfo",
  initialState: initialState,
  reducers: {
    ValidationsActions: function (state, action) {
      const { flat, floor, option, location } = action.payload;
      if (action.payload.action_type === "FLAT") {
        state.validations = {
          ...state.validations,
          flat
        }
      }
      else if (action.payload.action_type === "FLOOR") {
        state.validations = {
          ...state.validations,
          floor
        }
      }
      else if (action.payload.action_type === "OPTION") {
        state.validations = {
          ...state.validations,
          option
        }
      }
      else if (action.payload.action_type === "LOCATION") {
        state.validations = {
          ...state.validations,
          location
        }
      }
      else {
        state.validations = {
          flat: false,
          floor: false,
          option: false,
          location: false
        }
      }
    },
    ProjectActions: function (state, action) {
      const { project_id } = action.payload;
      if (action.payload.action_type === "ADD") {
        // state.parkingDetails =
        //   create_parking_for_the_project_object(project_id);
      }
    },
    TowerActions: function (state, action) {
      const { project_id, tower_id } = action.payload;
      if (action.payload.action_type === "ADD") {
        // state.parkingDetails[project_id].towers = {
        //   ...state.parkingDetails[project_id].towers,
        //   ...create_parking_for_the_project_tower_object(tower_id)
        // }

      }
    },
    CurrectRuleActions: function (state, action) {
      const {
        project_id,
        tower_id,
        currect_rule
      } =
        action.payload;
      if (action.payload.action_type === "ADD") {
        state.parkingDetails = {
          ...currect_rule
        };
      }
    },
    EligibilityActions: function (state, action) {
      const {
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking } =
        action.payload;
      if (action.payload.action_type === "ADD") {
        state.parkingDetails = {
          ...state.parkingDetails,
          ...create_Basis_of_no_of_eligible_car_parking_object(
            basis_of_no_of_eligible_car_parking
          ),
        };
      }
    },
    FlatActions: function (state, action) {
      const {
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking,
        flat_range,
        no_of_car_parkings,
      } = action.payload;
      if (action.payload.action_type === "ADD") {
        state.parkingDetails[basis_of_no_of_eligible_car_parking] =
        {
          ...state.parkingDetails[basis_of_no_of_eligible_car_parking],
          [flat_range]: {
            no_of_car_parkings,
            floor_ranges: {}
          }
        };
      } else if (action.payload.action_type === "DELETE") {
        delete state.parkingDetails[basis_of_no_of_eligible_car_parking][flat_range]
      } else if (action.payload.action_type === "EDIT") {

      }
    },
    FloorRangeActions: function (state, action) {
      const {
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking,
        flat_range,
        floor_range,
      } = action.payload;
      if (action.payload.action_type === "ADD") {
        state.parkingDetails[basis_of_no_of_eligible_car_parking][flat_range].floor_ranges = {
          ...state.parkingDetails[basis_of_no_of_eligible_car_parking][flat_range].floor_ranges,
          [floor_range]: {
            options: {}
          }
        };
      } else if (action.payload.action_type === "DELETE") {
        state.parkingDetails[basis_of_no_of_eligible_car_parking][flat_range].floor_ranges = {}
      }
    },
    OptionsActions: function (state, action) {
      const {
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking,
        flat_range,
        floor_range,
        option
      } = action.payload;
      if (action.payload.action_type === "ADD") {
        state.parkingDetails[basis_of_no_of_eligible_car_parking][flat_range].floor_ranges[floor_range].options = {
          ...state.parkingDetails[basis_of_no_of_eligible_car_parking][flat_range].floor_ranges[floor_range].options,
          [option]: {
            locations: {

            }
          }
        };
      } else if (action.payload.action_type === "DELETE") {
        delete state.parkingDetails[basis_of_no_of_eligible_car_parking][flat_range].floor_ranges[floor_range].options[option]
      }
    },
    LocationAllocationActions: function (state, action) {
      const {
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking,
        flat_range,
        floor_range,
        option,
        location,
        no_of_parkings,
        back_to_back,
      } = action.payload;
      if (action.payload.action_type === "ADD") {
        state.parkingDetails[basis_of_no_of_eligible_car_parking][flat_range].floor_ranges[floor_range].options[option].locations = {
          ...state.parkingDetails[basis_of_no_of_eligible_car_parking][flat_range].floor_ranges[floor_range].options[option].locations,
          ...create_location_object(
            location,
            no_of_parkings,
            back_to_back,
          ),
        };
      } else if (action.payload.action_type === "DELETE") {
        delete state.parkingDetails[basis_of_no_of_eligible_car_parking][flat_range].floor_ranges[floor_range].options[option].locations[location]
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //Projects
      .addCase(getParkingProjects.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getParkingProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.parkingDetails = {};
      })
      .addCase(getParkingProjects.rejected, (state, action) => {
        state.loading = false;
        state.message = "Something went wrong!";
      })
      //Towers
      .addCase(getParkingProjectTowers.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getParkingProjectTowers.fulfilled, (state, action) => {
        state.loading = false;
        state.towers = action.payload.data
      })
      .addCase(getParkingProjectTowers.rejected, (state, action) => {
        state.loading = false;
        state.message = "Something went wrong!";
      })
      //Floors
      .addCase(getParkingProjectTowerFloors.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getParkingProjectTowerFloors.fulfilled, (state, action) => {
        state.loading = false;
        state.noOfFloors = action.payload.data[0].total_no_of_floors
      })
      .addCase(getParkingProjectTowerFloors.rejected, (state, action) => {
        state.loading = false;
        state.message = "Something went wrong!";
      })
      //Flat Types
      .addCase(getParkingProjectTowerFlatTypes.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getParkingProjectTowerFlatTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.flatTypes = action.payload.data.map((flat: any) => (
          {
            label: flat.bedrooms,
            value: flat.bedrooms.split(" ").join("")
          }
        ))
      })
      .addCase(getParkingProjectTowerFlatTypes.rejected, (state, action) => {
        state.loading = false;
        state.message = "Something went wrong!";
      })
      //Flat Sizes
      .addCase(getParkingProjectTowerFlatSizes.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getParkingProjectTowerFlatSizes.fulfilled, (state, action) => {
        state.loading = false;
        state.flatSizes = action.payload.data?.map((flat: any) => (
          {
            label: flat.saleable_area,
            value: flat.saleable_area,
          }
        ))
      })
      .addCase(getParkingProjectTowerFlatSizes.rejected, (state, action) => {
        state.loading = false;
        state.message = "Something went wrong!";
      })
      //Flat Sizes
      .addCase(getParkingProjectTowerLocations.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getParkingProjectTowerLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.locations = action.payload.data.map((location: any) => ({
          label: location.parking_location_name,
          value: location.parking_location_code
        }))
      })
      .addCase(getParkingProjectTowerLocations.rejected, (state, action) => {
        state.loading = false;
        state.message = "Something went wrong!";
      })

      //Post Parking Rules
      .addCase(postParkingRules.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(postParkingRules.fulfilled, (state, action) => {
        state.loading = false;
        toast.success("Parking rules created successfully!");
      })
      .addCase(postParkingRules.rejected, (state, action) => {
        state.loading = false;
        state.message = "Something went wrong!";
        toast.error("Something went wrong!");
      })

      //Update Parking Rule Inforce
      .addCase(updateParkingRuleInforce.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateParkingRuleInforce.fulfilled, (state, action) => {
        state.loading = false;
        toast.success("Parking rule in-forced successfully!");
      })
      .addCase(updateParkingRuleInforce.rejected, (state, action) => {
        state.loading = false;
        state.message = "Something went wrong!";
        toast.error("Something went wrong!");
      });
  },
});

export const {
  ValidationsActions,
  ProjectActions,
  TowerActions,
  CurrectRuleActions,
  EligibilityActions,
  FlatActions,
  FloorRangeActions,
  OptionsActions,
  LocationAllocationActions,
} = createParkingInfoSlice.actions;
export default createParkingInfoSlice.reducer;
