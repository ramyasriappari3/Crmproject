import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myTaskCardProps } from "@Components/my-task-card/MyTaskCard";
import "./MyPropertyPage.scss";
import "../my-task/MyTaskPage.scss";
import MyPropertyCard from "@Components/my-property-card/MyPropertyCard";
import PendingTaskCardSidebar from "@Components/pending-task-card-sidebar/PendingTaskCardSidebar";
import { IAPIResponse } from "@Src/types/api-response-interface";
import { MODULES_API_MAP, httpService } from "@Src/services/httpService";
import { GLOBAL_API_ROUTES } from "@Src/services/globalApiRoutes";
import MyCarousel from "@Components/AutoCarousel/MyCarousel";
import { MyContext } from '@Src/Context/RefreshPage/Refresh';
import { useAppDispatch } from "@Src/app/hooks";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { getDataFromLocalStorage, setDataOnLocalStorage } from "@Src/utils/globalUtilities";
import TestPDF from "@Components/react-pdf/ReviewApplicationPDF";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { LOCAL_STORAGE_DATA_KEYS } from "@Constants/localStorageDataModel";

const MyPropertyPage = () => {
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState<any>([]);
  const { cust_unit_id, setCustUnitId, setUnitId, setModifiedBy } = useContext(MyContext);
  const [custUnitDetails, setCustUnitDetails] = useState<any>();
  const [projectId, setProjectId] = useState<any>();
  const [tasks, setTasks] = useState<myTaskCardProps[]>([]);
  const dispatch = useAppDispatch();
  const userDetails = JSON.parse(getDataFromLocalStorage('user_details'));
  const getMyPropertyData = async () => {
    try {
      dispatch(showSpinner());
      const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.CUSTOMER_UNITS}`).GET();
      if (apiResponse?.success) {
        setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.CUST_UNIT_ID, apiResponse?.data?.resultData?.[0]?.cust_unit_id);
        setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.UNIT_ID, apiResponse?.data?.resultData?.[0]?.unit_id);
        setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.CUST_PROFILE_ID, apiResponse?.data?.resultData?.[0]?.cust_profile_id);
        setDataOnLocalStorage(LOCAL_STORAGE_DATA_KEYS.APPLICATION_STATUS, apiResponse?.data?.resultData?.[0]?.application_status);
        setCustUnitId(apiResponse?.data?.resultData?.[0]?.cust_unit_id);
        setUnitId(apiResponse?.data?.resultData?.[0]?.unit_id);
        setPropertyData(apiResponse?.data?.resultData || []);
        setProjectId(apiResponse?.data?.resultData?.[0]?.project_id);
      }
    } catch (error) {

    }
    finally {
      dispatch(hideSpinner());
    }

  }

  const getMyTasks = async () => {
    if (!cust_unit_id) {
      return;
    }
    try {
      dispatch(showSpinner());
      const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.MY_TASKS}?cust_unit_id=${cust_unit_id}`).GET();
      if (apiResponse?.success) {
        setTasks(apiResponse?.data?.[0]?.pendingTasks)
        setCustUnitDetails(apiResponse?.data?.[0]);
      }
    } catch (error) {
      //console.log(error)
    }
    finally {
      dispatch(hideSpinner());
    }
  }

  useEffect(() => {
    getMyTasks();
    getMyPropertyData();
    setModifiedBy(userDetails?.user_login_name);
  }, [cust_unit_id])

  return (
    <div className="tw-w-full">
      <div className="tw-flex tw-flex-col xl:tw-flex-row tw-justify-between tw-gap-6">
        <div className="tw-w-full xl:tw-w-3/4">
          <p className="tw-text-black tw-text-xl tw-font-bold">My Bookings</p>
          {(propertyData || []).map((data: any, index: any) => (
            <MyPropertyCard
              key={index}
              unit_id={data.unit_id}
              project_image={data?.project_images}
              unit_type={data.unit_type_id}
              progress_bar_data={data?.progressBarResponse}
              project_name={data.project_name}
              tower_code={data.tower_code}
              unit_no={data.unit_no}
              floor_no={data.floor_no}
              project_city={data.project_city}
              project_state={data.project_state}
              saleable_area={data.saleable_area}
              covered_area={data.covered_area}
              common_area={data.common_area}
              balcony_area={data.balcony_area}
              uds_area={data.uds_area}
              carpet_area={data.carpet_area}
              bedrooms={data.bedrooms}
              no_of_parkings={data.no_of_parkings}
              facing={data.facing}
              total_sale_consideration_with_gst={data.calculationFields?.total_sale_consideration_with_gst}
              total_amount_paid={data.total_amount_paid}
              total_due_amount={data.total_due_amount}
              balance_amount={data.balance_amount}
              total_payable_amount={data.total_payable_amount}
              total_billed_amount={data.total_billed_amount}
            />
          ))}
        </div>
        <div className="tw-flex tw-flex-col tw-w-full xl:tw-w-1/4">
          {tasks?.length > 0 ? (
            <>
              <p className="tw-text-xl tw-text-black tw-font-bold">
                My Tasks
              </p>
              {(tasks?.slice(0, 2) || [])?.map((task: any, index: any) => {
                return (
                  <PendingTaskCardSidebar
                    key={index}
                    task={task}
                    custUnitDetails={custUnitDetails}
                    getMyTasks={getMyTasks}
                  />
                );
              })}
              <button
                className="tw-p-2 tw-bg-blue-600/10 tw-w-full tw-mb-4 tw-rounded-lg tw-text-blue-600 tw-font-semibold tw-text-sm"
                onClick={() => {
                  navigate("/my-task-page");
                }}
              >
                View all
              </button>
            </>
          ) : (
            ""
          )}
          <div className="tw-flex tw-flex-col tw-justify-end tw-w-full tw-h-80 tw-rounded-2xl tw-overflow-hidden tw-shadow-md ">
            <MyCarousel projectId={projectId} />
          </div>
        </div>
        {/* <PDFViewer style={{ width: "100%", backgroundColor: "white", height: "90vh" }}>
          <TestPDF name={"Madhav"} />
        </PDFViewer> */}
        {/* <PDFDownloadLink document={<TestPDF />} fileName="somename.pdf">
          {({ blob, url, loading, error }) =>
            loading ? 'Loading document...' : 'Download now!'
          }
        </PDFDownloadLink> */}
      </div>
    </div>

  )
}

export default MyPropertyPage;
