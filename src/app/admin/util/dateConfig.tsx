import moment from "moment";
const getDateCurToReqFormat = (dateInfo: string, currentFormat: string, requiredFormat: string) => {
    return dateInfo ? moment(dateInfo, currentFormat).format(requiredFormat) : "";
}

const dateConfig = {getDateCurToReqFormat};
export default dateConfig;