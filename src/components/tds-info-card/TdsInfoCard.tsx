import React from 'react'
import './TdsInfoCard.scss'
import InfoIcon from '@mui/icons-material/Info';

interface TdsInfo {
  tdsData: {
    term_id: string;
    type: string;
    description: string;
    last_modified_by: string;
    last_modified_at: string;
  }[];
}

const TdsInfoCard: React.FC<TdsInfo> = ({ tdsData }) => {
  return (
    <div className="tds_info_card">
      <div className="tw-flex">
        <InfoIcon className="tw-mr-3 tw-text-[rgb(235,159,12)] tw-scale-125" />
        <h3 className="tw-font-bold">TDS info</h3>
      </div>
      <p className="tw-text-sm tw-pt-3">
        {tdsData?.[0]?.description}
      </p>
    </div>
  );
};

export default TdsInfoCard