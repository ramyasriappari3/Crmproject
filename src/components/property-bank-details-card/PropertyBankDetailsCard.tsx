import { capitalizeFirstLetter } from '@Src/utils/globalUtilities';
import './PropertyBankDetailsCard.scss';

const PropertyBankDetailsCard = ({ propertyData }: { propertyData: any }) => {
    const bankDetails = [
        { title: 'Bank', value: propertyData?.developer_bank_account_name },
        { title: 'Branch', value: propertyData?.developer_bank_branch_name },
        { title: 'IFSC Code', value: propertyData?.developer_bank_account_ifsc_code },
        { title: 'A/C Number', value: propertyData?.developer_bank_account_number },
        { title: 'Bank Account Holder Name', value: propertyData?.developer_bank_account_payee_details }
    ];
    
    return (
        <div className='card'>
            <h2 className='tw-font-bold'>Property Bank Details for <br />
                {capitalizeFirstLetter(propertyData?.project_name)}
            </h2>
            <div className='tw-mt-2 tw-w-[100%] tw-grid tw-grid-cols-2 tw-gap-4'>
                {bankDetails.map((detail, index) => (
                    <div key={index} className='tw-col-span-full'>
                        <p className='section-titles'>{detail.title}</p>
                        <p className='tw-font-bold'>{detail.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PropertyBankDetailsCard;
