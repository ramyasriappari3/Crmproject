import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useParkingHook from "./ParkingHooks";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { useAppDispatch, useAppSelector } from "@Src/app/hooks";
import { getParkingProjectTowers, TowerActions } from "../../redux/features/create.parking.info.slice";
import CustomTable from "@Components/custom-table/CustomTable";
import { IoMdArrowRoundBack } from "react-icons/io";

const TowersContainer = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { project_id } = useParams();

  const towers = useAppSelector(
    (state: any) => state.parkingInfo.towers
  );

  console.log(towers, "towers123")

  const getTowers = async () => {
    dispatch(showSpinner());

    await dispatch(
      getParkingProjectTowers({
        url_name: "crm_get_parking_project_towers",
        params_data: { project_id },
      })
    ).unwrap();

    dispatch(hideSpinner());
  };

  useEffect(() => {
    getTowers();
  }, []);

  const handleTowerClick = (tower: any) => {

    const currTower = {
      tower_id: tower?.tower_id,
      tower_name: tower?.tower_name,
      tower_code: tower?.tower_code,
    }

    dispatch(
      TowerActions({
        action_type: "ADD",
        project_id,
        tower_id: currTower?.tower_id,
      }))

    navigate("/crm/admin/parking/" + project_id + "/" + tower?.tower_id + "/versions", { state: { currTower } });
  }

  // Add this function to sort towers by last_modified_at
  const sortTowersByLastModified = (towers: any[]) => {
    return [...towers].sort((a, b) => {
      const dateA = new Date(a.last_modified_at).getTime();
      const dateB = new Date(b.last_modified_at).getTime();
      return dateB - dateA; // Sort in descending order (most recent first)
    });
  };

  return (
    <div className="tw-min-h-[85vh] tw-w-full tw-bg-white tw-mt-6 tw-p-6 tw-shadow-lg tw-rounded-2xl">
      <CustomTable>
        <div className="tw-flex tw-gap-4 tw-text-black tw-text-3xl tw-font-bold tw-items-center tw-mb-4">
          <button onClick={() => navigate(-1)}>
            <IoMdArrowRoundBack />
          </button>
          <p className="">
            Project Towers
          </p>
        </div>
        <CustomTable.Header grid={3} headers={["Block Name", "Block Code"]} />
        {sortTowersByLastModified(towers).map((tower: any, index: any) => (
          <CustomTable.Value
            key={index}
            grid={3}
            values={
              [tower.tower_name,
              tower.tower_code,
              ]}
            viewTitle={"Configure Parking Rules"}
            handleView={() => handleTowerClick(tower)}
          />
        ))
        }
      </CustomTable>

    </div>
  );
};

export default TowersContainer;

