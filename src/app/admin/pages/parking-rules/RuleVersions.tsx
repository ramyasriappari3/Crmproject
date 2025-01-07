import { useAppDispatch, useAppSelector } from '@Src/app/hooks';
import { hideSpinner, showSpinner } from '@Src/features/global/globalSlice';
import React, { useEffect, useState } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CurrectRuleActions, getParkingTowerVersions, postParkingRules, updateParkingRuleInforce } from '../../redux/features/create.parking.info.slice';
import CustomTable from '@Components/custom-table/CustomTable';
import { FaCheckCircle } from "react-icons/fa";
import { version } from 'os';
import { formatExactDate, formatExactDateTime } from '@Src/utils/globalUtilities';

const RuleVersions = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { project_id, tower_id } = useParams();
    const [updated, setUpdated] = useState(true);

    const [allVersions, setAllVerions] = useState<any>();

    const { currTower } = useLocation().state;


    const getVersions = async () => {
        dispatch(showSpinner());

        const { data } = await dispatch(
            getParkingTowerVersions({
                url_name: "crm_get_parking_rules_versions",
                params_data: { project_id, tower_id },
            })
        ).unwrap();

        setAllVerions(data);

        dispatch(hideSpinner());
    }

    useEffect(() => {
        if (updated) {
            getVersions();
            setUpdated(false);
        }
    }, [updated])

    const sortedVersions = allVersions?.sort((a: any, b: any) =>
        new Date(a.created_on).getTime() - new Date(b.created_on).getTime()
    );

    const handleViewVersion = (rule_object: any) => {
        navigate("/crm/admin/parking/" + project_id + "/" + tower_id + "/" + rule_object.rule_id, { state: { currTower, rule_object } });
    }

    const handleNewVersion = () => {

        dispatch(CurrectRuleActions({
            action_type: "ADD",
            project_id,
            tower_id,
            currect_rule: {}
        }));

        navigate("/crm/admin/parking/" + project_id + "/" + tower_id, { state: { currTower } });
    }

    const previous_rule_id = allVersions?.filter((version: any) => version.in_inforce === true)?.[0]?.rule_id;
    let options:any = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };

    return (
        <div className="tw-min-h-[85vh] tw-w-full tw-bg-white tw-mt-6 tw-p-6 tw-shadow-lg tw-rounded-2xl">
            <CustomTable>
                <div className="tw-flex tw-items-center tw-justify-between tw-w-full tw-mb-5">
                    <div className="tw-flex tw-gap-4 tw-text-black tw-text-3xl tw-font-bold tw-items-center tw-mb-4">
                        <button onClick={() => navigate(-1)}>
                            <IoMdArrowRoundBack />
                        </button>
                        <p className="">
                            All <span className='tw-text-red-700'>{currTower?.tower_name}</span>'s Parking Rules Versions
                        </p>
                    </div>
                    <button
                        onClick={handleNewVersion}
                        className=" tw-p-3 tw-px-6 tw-text-white tw-w-fit tw-font-semibold tw-bg-blue-500 tw-rounded-lg tw-text-sm"
                    >
                        Add New Version
                    </button>
                </div>
                <CustomTable.Header grid={3} headers={["Version Name", "Creation Date", "Start Date", "End Date", "Inforce"]} />
                {sortedVersions && sortedVersions.map((version: any, index: any) => (
                    <CustomTable.Value
                        key={index}
                        grid={3}
                        values={
                            ["Version " + (index + 1),
                            new Date(version.created_on)?.toLocaleString('en-GB', options).replace(',', ''),
                            formatExactDate(version.rule_start_date),
                            formatExactDate(version.rule_end_date),
                            version.in_inforce ? <div className='tw-flex tw-gap-2 tw-text-green-500 tw-text-xl tw-items-center'><FaCheckCircle /><p className=' tw-font-bold'>Inforce</p></div> : <MakeInForce current_rule_id={version?.rule_id} previous_rule_id={previous_rule_id} setUpdated={setUpdated} />
                            ]}
                        viewTitle={"View Parking Rule"}
                        handleView={() => handleViewVersion(version)}
                    />
                ))
                }
            </CustomTable>
        </div>
    )
}

export default RuleVersions;

const MakeInForce = ({ current_rule_id, previous_rule_id, setUpdated }: { current_rule_id: any; previous_rule_id: any; setUpdated: any }) => {

    const dispatch = useAppDispatch();

    const handleMakeInForce = async () => {
        dispatch(showSpinner());

        await dispatch(
            updateParkingRuleInforce({
                url_name: "crm_update_parking_rules_version_in_force",
                body: {
                    current_rule_id,
                    previous_rule_id
                },
            })
        ).unwrap();

        setUpdated(true);

        dispatch(hideSpinner());
    }

    return (
        <button className='tw-p-2 tw-border tw-border-blue-600 hover:tw-bg-blue-600 tw-text-blue-600 tw-transition-all tw-duration-300 hover:tw-text-white tw-rounded-md tw-text-xs' onClick={handleMakeInForce}>
            Make it inforce
        </button>
    )
}

