import { useAppSelector } from "@Src/app/hooks";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useParkingHook = () => {
  const navigate = useNavigate();

  const parkingDetails = useAppSelector(
    (state: any) => state.parkingInfo.parkingDetails
  );

  useEffect(() => {
    console.log(parkingDetails, "OUT");
    if (!parkingDetails) {
      console.log(parkingDetails, "IN");
      navigate("/crm/parking");
    }
  }, [parkingDetails]);

  return {
    parkingDetails,
  };
};

export default useParkingHook;
