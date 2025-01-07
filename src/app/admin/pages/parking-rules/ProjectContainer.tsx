import CustomDropdown from "@Components/custom-dropdown/CustomDropdown";
import {
  getParkingProjects,
  ProjectActions,
} from "@Src/app/admin/redux/features/create.parking.info.slice";
import { useAppDispatch } from "@Src/app/hooks";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectContainer = () => {
  const dispatch = useAppDispatch();

  const [projectOptions, setProjectOptions] = useState([]);

  const getProjects = async () => {
    dispatch(showSpinner());

    const { data } = await dispatch(
      getParkingProjects({
        url_name: "crm_get_parking_projects",
        params_data: {},
      })
    ).unwrap();

    const optionData = data.map((option: any) => ({
      value: option?.project_id,
      label: option?.project_name,
    }));

    setProjectOptions(optionData);

    dispatch(hideSpinner());
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="tw-min-h-[85vh] tw-w-full tw-bg-white tw-px-6 tw-shadow-lg tw-rounded-2xl tw-flex tw-items-start tw-flex-col tw-p-4">
      <AddProject projectOptions={projectOptions} />
    </div>
  );
};

export default ProjectContainer;

const AddProject = ({ projectOptions }: { projectOptions: any }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currProject, setCurrProject] = useState<any>([]);
  const [projectErr, setProjectErr] = useState();
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const handleAddEligibility = () => {
    setFormSubmitted(true);
    if (!projectErr) {
      dispatch(
        ProjectActions({
          action_type: "ADD",
          project_id: currProject[0].value,
        })
      );

      navigate("/crm/admin/parking/" + currProject[0]?.value);
    }
  };

  return (
    <>
      <p className="tw-flex tw-gap-4 tw-text-black tw-text-3xl tw-font-bold tw-items-center tw-my-4">
        Select Project
      </p>
      <div className="tw-flex tw-flex-col tw-justify-between tw-gap-4 tw-h-[70vh] tw-w-full">
        <div className="tw-w-1/3">
          <CustomDropdown
            label=""
            validationRules={["required"]}
            multi={false}
            selectedvalues={currProject}
            setSelectedValues={setCurrProject}
            searchable={false}
            selectPlaceholder={"Select an item"}
            searchPlaceholder={"Search item"}
            options={projectOptions}
            formSubmitted={formSubmitted}
            setIsError={setProjectErr}
            sticky={true}
          />
        </div>
        <div className="tw-flex tw-justify-end">
          <button
            onClick={handleAddEligibility}
            className=" tw-p-3 tw-px-6 tw-text-white tw-font-semibold tw-bg-blue-500 tw-rounded-lg tw-text-sm"
          >
            Add Criteria
          </button>
        </div>
      </div>
    </>
  );
};
