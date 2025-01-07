import React, { useEffect, useState, useMemo, useCallback } from 'react';
import "./MyTaskPage.scss"
import MyTaskCard from '@Components/my-task-card/MyTaskCard';
import { MODULES_API_MAP, httpService } from '@Src/services/httpService';
import { GLOBAL_API_ROUTES } from '@Src/services/globalApiRoutes';
import { IAPIResponse } from '@Src/types/api-response-interface';
import { useAppDispatch } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import NoResultFound from '@Components/no-result-found/NoResultFound';
import { getDataFromLocalStorage } from '@Src/utils/globalUtilities';
import { LOCAL_STORAGE_DATA_KEYS } from '@Constants/localStorageDataModel';

interface MyTaskCardProps {
    task_title: string;
    task_description: string;
    task_type: string;
    booking_id: number;
    task_due_date: string;
    button_text: string;
    icon: string;
    status: string;
    created_on: string;
    updated_on: any;
    project_name: string;
    address: string;
    project_no: number;
    tower_no: number;
    tower_name: string;
    floor_name: string;
    floor_no: number;
    route: string;
    unit_id: number;
    date_of_completion: string;
    applied_milestone_percentage: string;
    invoice_amount: string;
    functionChangeShow: Function;
    invoice_date: string;
    task_status: string;
    doc_task_status: string;
}

const MyTaskPage: React.FC = () => {
    const [tasks, setTasks] = useState<{ completed: MyTaskCardProps[], pending: MyTaskCardProps[] }>({ completed: [], pending: [] });
    const [searchText, setSearchText] = useState("");
    const [custUnitDetails, setCustUnitDetails] = useState<any>();
    const [loading, setLoading] = useState(true);
    const cust_unit_id = getDataFromLocalStorage(LOCAL_STORAGE_DATA_KEYS.CUST_UNIT_ID);
    const dispatch = useAppDispatch();
    const [currentTab, setCurrentTab] = useState(1);

    const getMyTasks = useCallback(async () => {
        dispatch(showSpinner());
        try {
            const apiResponse: IAPIResponse = await httpService(MODULES_API_MAP.AUTHENTICATION, `${GLOBAL_API_ROUTES.MY_TASKS}?cust_unit_id=${cust_unit_id}`).GET();
            if (apiResponse?.success) {
                const { closedTasks, pendingTasks } = apiResponse.data?.[0] || {};
                setCustUnitDetails(apiResponse.data?.[0]);
                setTasks({ completed: closedTasks || [], pending: pendingTasks || [] });
            }
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            dispatch(hideSpinner());
            setLoading(false);
        }
    }, [cust_unit_id, dispatch]);

    const filterTasks = useCallback((tasks: MyTaskCardProps[]) => {
        const lowerCaseSearchTerm = searchText.toLowerCase();
        return tasks.filter((task) =>
            task?.task_title?.toLowerCase().includes(lowerCaseSearchTerm) ||
            task?.task_description?.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [searchText]);

    const filteredPendingTasks = useMemo(() => filterTasks(tasks.pending), [filterTasks, tasks.pending]);
    const filteredCompletedTasks = useMemo(() => filterTasks(tasks.completed), [filterTasks, tasks.completed]);

    useEffect(() => {
        getMyTasks();
    }, [getMyTasks]);

    const renderTaskCards = useCallback((tasks: MyTaskCardProps[], noResultMessage: string) => {
        return tasks.length > 0 ? (
            tasks.map((task) => <MyTaskCard key={task.booking_id} task={task} custUnitDetails={custUnitDetails} setCurrentTab={setCurrentTab} getMyTasks={getMyTasks} />)
        ) : (
            <NoResultFound description={noResultMessage} />
        );
    }, [custUnitDetails, getMyTasks]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='my-task-cont'>
            <div className='md:tw-flex tw-items-center tw-justify-between tw-mb-4 ' >
                <p className='text-pri-all md:tw-w-[40%] tw-w-full tw-font-bold md:tw-mb-0 tw-mb-4'>Pending Tasks</p>
                <div className='tw-flex md:tw-w-[60%] tw-w-full search-box'>
                    <img src="/images/search-icon.svg" alt="" />
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder='Search here..'
                    />
                </div>
            </div>

            {renderTaskCards(searchText ? filteredPendingTasks : tasks.pending, searchText ? 'No pending tasks' : '')}

            <p className='text-pri-all tw-my-8 tw-font-bold'>Completed Tasks</p>

            {renderTaskCards(searchText ? filteredCompletedTasks : tasks.completed, searchText ? 'No completed tasks' : '')}
        </div>
    );
};

export default MyTaskPage;
