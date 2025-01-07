import { useEffect, useState } from 'react';
import "./LeftSidebar.scss";
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as HomeRoundedIcon } from '../../assets/Images/home-rounded.svg';
import { ReactComponent as HomeLoanIcon } from '../../assets/Images/home-loan-icon.svg';
const LeftSidebar = () => {
    const [activeTab, setActiveTab] = useState('home');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSidebar = (tabName: any) => {
        setActiveTab(tabName);
        if (tabName == 'dashboard') {
            navigate('/dashboard')

        } else if (tabName == 'my-task-page') {
            navigate('/my-task-page')
        }
        else if (tabName == 'help') {
            navigate('/help')
        }
        else if (tabName == 'home-loan-page') {
            navigate('/home-loan-page')
        }
        // else if (tabName == 'test') {
        //     navigate('/test')
        // }
        else {
            navigate('/dashboard');
        }

    }

    useEffect(() => {
        const tabName = location.pathname.split('/').pop();
        if (tabName == 'dashboard') {
            setActiveTab('dashboard');
        } else if (tabName == 'my-task-page') {
            setActiveTab('my-task-page');
        } else if (tabName == 'help') {
            setActiveTab('help');
        }
        else if (tabName == 'home-loan-page') {
            setActiveTab('home-loan-page');
        }
        else {
            setActiveTab('dashboard');
        }
    }, [location.pathname]);

    return (
        <div className="lft-sidebar">
            <div className="logo-container">
                <img src="/logo.png" alt="" />
            </div>
            <div className='tabs tw-mt-6'>
                <div onClick={() => handleSidebar('dashboard')} className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}>
                    <HomeRoundedIcon fill={activeTab === 'dashboard' ? '#3C4049' : '#656C7B'} className='tw-size-6' />
                    <span className='tab-name'>Home</span>
                </div>
                <div onClick={() => handleSidebar('my-task-page')} className={`tab ${activeTab === 'my-task-page' ? 'active' : ''}`}>
                    <span><AddTaskIcon sx={{ fontSize: '24px' }} /></span>
                    <span className='tab-name'>My tasks</span>
                </div>
                {/* <div onClick={() => handleSidebar('home-loan-page')} className={`tab ${activeTab === 'home-loan-page' ? 'active' : ''}`}>
                    <HomeLoanIcon fill={activeTab === 'home-loan-page' ? '#3C4049' : '#656C7B'} className='tw-size-6' />
                    <span className='tab-name'>Home Loan</span>
                </div> */}
                <div onClick={() => handleSidebar('help')} className={`tab ${activeTab === 'help' ? 'active' : ''}`}>
                    <span><LiveHelpOutlinedIcon sx={{ fontSize: '24px' }} /></span>
                    <span className='tab-name'>Help</span>
                </div>
            </div>
        </div>
    );
};

export default LeftSidebar;