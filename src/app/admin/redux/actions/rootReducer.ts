import createApplicationInfoSlice from '../features/create.application.info.slice';
import createParkingInfoSlice from '../features/create.parking.info.slice';


const rootReducer = {
    applicationInfo: createApplicationInfoSlice,
    parkingInfo: createParkingInfoSlice
}
export default rootReducer;