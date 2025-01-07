import Api from "@App/admin/api/Api";
import getApiUrl from "@App/admin/api/ApiUrls";
import { Label } from "@mui/icons-material";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { actions } from "react-table";

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

const create_allocation_basis_object = (
  no_of_car_parkings: any,
  allocation_basis: string
) => {
  return {
    no_of_car_parkings,
    allocation_basis: allocation_basis,
    [allocation_basis]: {},
  };
};

const create_allocation_location_object = (
  allocation_location: string,
  allocation_basis: string,
  no_of_car_parkings: any
) => {
  if (allocation_basis !== "floor_range" && allocation_location !== "multi") {
    return {
      allocation_location: allocation_location,
      [allocation_location]: {
        total_no_of_options: "4",
        no_of_locations_per_option: {
          option1: 1,
          option2: 1,
          option3: 1,
          option4: 1,
        },
        option1: {
          "basement-1": {
            no_of_parkings: no_of_car_parkings,
            back_to_back: false,
          },
        },
        option2: {
          "basement-2": {
            no_of_parkings: no_of_car_parkings,
            back_to_back: false,
          },
        },
        option3: {
          "basement-3": {
            no_of_parkings: no_of_car_parkings,
            back_to_back: false,
          },
        },
        option4: {
          "basement-4": {
            no_of_parkings: no_of_car_parkings,
            back_to_back: false,
          },
        },
      },
    };
  }
  return {
    allocation_location: allocation_location,
    [allocation_location]:
      allocation_location === "multi"
        ? {}
        : {
          total_no_of_options: "1",
          no_of_locations_per_option: {
            option1: 1,
          },
          option1: {},
        },
  };
};

const create_options_object = (
  total_no_of_options: any,
  no_of_locations_per_option: any
) => {
  const valueObject: { [key: string]: any } = {};
  const numOptions = Number(total_no_of_options);

  for (let i = 1; i <= numOptions; i++) {
    valueObject[`option${i}`] = {};
  }

  return {
    ...{ total_no_of_options },
    ...{ no_of_locations_per_option },
    ...valueObject,
  };
};

const create_location_object = (
  location: any,
  no_of_parkings: number,
  back_to_back: boolean,
  allocation_location: any,
  no_of_car_parkings: any
) => {
  if (allocation_location !== "multi") {
    return {
      [location]: {
        no_of_parkings: no_of_car_parkings,
        back_to_back,
      },
    };
  }
  return {
    [location]: {
      no_of_parkings,
      back_to_back,
    },
  };
};

interface ParkingInfoState {
  loading: boolean;
  // resStatus: boolean | null;
  // resStatusCode: number | null;
  responseData: any;
  message: string;
  parkingDetails: any;
  towers: any;
  flatTypes: any;
  flatSizes: any;
  noOfFloors: any;
  locations: any;
}

const initialState: ParkingInfoState = {
  loading: false,
  // resStatus: false,
  // resStatusCode: 200,
  responseData: [],
  message: "",
  parkingDetails: {},
  towers: [],
  flatTypes: [],
  flatSizes: [],
  noOfFloors: "",
  locations: [],
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

const createParkingInfoSlice = createSlice({
  name: "createParkingInfo",
  initialState: initialState,
  reducers: {
    ProjectActions: function (state, action) {
      const { project_id } = action.payload;
      if (action.payload.action_type === "ADD") {
        state.parkingDetails =
          create_parking_for_the_project_object(project_id);
      }
    },
    TowerActions: function (state, action) {
      const { project_id, tower_id } = action.payload;
      if (action.payload.action_type === "ADD") {
        state.parkingDetails[project_id].towers = {
          ...state.parkingDetails[project_id].towers,
          ...create_parking_for_the_project_tower_object(tower_id)
        }

      }
    },
    EligibilityActions: function (state, action) {
      const { project_id, tower_id, basis_of_no_of_eligible_car_parking } =
        action.payload;
      if (action.payload.action_type === "ADD") {
        state.parkingDetails[project_id].towers[tower_id] = {
          ...state.parkingDetails[project_id].towers[tower_id],
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
        allocation_basis,
      } = action.payload;

      if (action.payload.action_type === "ADD") {
        state.parkingDetails[project_id].towers[tower_id][basis_of_no_of_eligible_car_parking][flat_range] =
        {
          ...state.parkingDetails[project_id].towers[tower_id][basis_of_no_of_eligible_car_parking][
          flat_range
          ],
          ...create_allocation_basis_object(
            no_of_car_parkings,
            allocation_basis
          ),
        };
      }
    },
    FloorRangeActions: function (state, action) {
      const {
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking,
        flat_range,
        no_of_car_parkings,
        allocation_basis,
        floor_range,
        allocation_location,
      } = action.payload;
      if (action.payload.action_type === "ADD") {
        state.parkingDetails[project_id].towers[tower_id][basis_of_no_of_eligible_car_parking][flat_range][
          allocation_basis
        ] = {
          ...state.parkingDetails[project_id].towers[tower_id][basis_of_no_of_eligible_car_parking][
          flat_range
          ][allocation_basis],
          [floor_range]: create_allocation_location_object(
            allocation_location,
            allocation_basis,
            no_of_car_parkings
          ),
        };
      }
    },
    OptionsActions: function (state, action) {
      const {
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking,
        flat_range,
        allocation_basis,
        floor_range,
        allocation_location,
        total_no_of_options,
        no_of_locations_per_option,
      } = action.payload;
      if (action.payload.action_type === "ADD") {
        state.parkingDetails[project_id].towers[tower_id][basis_of_no_of_eligible_car_parking][flat_range][
          allocation_basis
        ][floor_range][allocation_location] = {
          ...create_options_object(
            total_no_of_options,
            no_of_locations_per_option
          ),
        };
      }
    },
    LocationAllocationActions: function (state, action) {
      const {
        project_id,
        tower_id,
        basis_of_no_of_eligible_car_parking,
        flat_range,
        no_of_car_parkings,
        allocation_basis,
        floor_range,
        allocation_location,
        option,
        location,
        no_of_parkings,
        back_to_back,
      } = action.payload;
      if (action.payload.action_type === "ADD") {
        state.parkingDetails[project_id].towers[tower_id][basis_of_no_of_eligible_car_parking][flat_range][
          allocation_basis
        ][floor_range][allocation_location][option] = {
          ...state.parkingDetails[project_id].towers[tower_id][basis_of_no_of_eligible_car_parking][
          flat_range
          ][allocation_basis][floor_range][allocation_location][option],
          ...create_location_object(
            location,
            no_of_parkings,
            back_to_back,
            allocation_location,
            no_of_car_parkings
          ),
        };
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
            value: flat.bedrooms
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
      });
  },
});

export const {
  ProjectActions,
  TowerActions,
  EligibilityActions,
  FlatActions,
  FloorRangeActions,
  OptionsActions,
  LocationAllocationActions,
} = createParkingInfoSlice.actions;
export default createParkingInfoSlice.reducer;
