import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box, SelectChangeEvent, Button, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import SlotSelectionPage from './SlotSelectionPage';
import Api from '@App/admin/api/Api';

interface ParkingLocation {
    project_name: string;
    project_code: string;
    project_id: string;
    tower_id: string;
    tower_code: string;
    tower_name: string;
    parking_location_code: string;
    parking_location_name: string;
    total_slots: string;
    location_url: string;
}

interface ParkingSlot {
    car_parking_code: string;
    car_parking_slot_number: string;
    parking_slot_status: string;
    location_desc: string;
    full_name: string;
    unit_no: string;
    customer_number: string;
}

const SelectionsContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'row', // Change to row for horizontal alignment
    gap: '20px',
    margin: '20px 0',
    alignItems: 'center', // Center items vertically
});

const StyledFormControl = styled(FormControl)({
    minWidth: '200px',
});

const StyledHeading = styled(Typography)({
    fontSize: '30px', // Adjust font size as needed
    fontWeight: 'bold',
    margin: '80px 0 10px 0', // Top margin added, bottom margin for spacing
    textAlign: 'left', // Align the heading to the left
    color: '#333', // Change color as needed
});

const BasementSelectionsPage: React.FC = () => {
    const [projects, setProjects] = useState<ParkingLocation[]>([]);
    const [towers, setTowers] = useState<ParkingLocation[]>([]);
    const [locations, setLocations] = useState<ParkingLocation[]>([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedTower, setSelectedTower] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showBookingPage, setShowBookingPage] = useState(false);
    const [selectedParkingLocation, setSelectedParkingLocation] = useState<ParkingLocation | null>(null);
    const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchTowers(selectedProject);
        }
    }, [selectedProject]);

    useEffect(() => {
        if (selectedProject && selectedTower) {
            fetchLocations(selectedProject, selectedTower);
        }
    }, [selectedProject, selectedTower]);

    const fetchProjects = async () => {
        setError(null);
        try {
            const { data, status: responseStatus, message }: any = await Api.get("crm_get_parking_project_list", {});
            if (responseStatus) {
                setProjects(data);
            } else {
                setError('Failed to fetch projects');
            }
        } catch (error) {
            setError('An error occurred while fetching projects');
            console.error('Error fetching projects:', error);
        } 
    };

    const fetchTowers = async (projectId: string) => {
        setError(null);
        try {
            const { data, status: responseStatus, message }: any = await Api.get("crm_get_parking_tower_list", {
                project_id: projectId
            });
            if (responseStatus) {
                setTowers(data);
            } else {
                setError('Failed to fetch towers');
            }
        } catch (error) {
            setError('An error occurred while fetching towers');
            console.error('Error fetching towers:', error);
        } 
    };

    const fetchLocations = async (projectId: string, towerId: string) => {
        setError(null);
        try {
            const { data, status: responseStatus, message }: any = await Api.get("crm_get_parking_location_list", {
                project_id: projectId,
                tower_id: towerId
            });
            if (responseStatus) {
                setLocations(data);
            } else {
                setError('Failed to fetch locations');
            }
        } catch (error) {
            setError('An error occurred while fetching locations');
            console.error('Error fetching locations:', error);
        }
    };

    const fetchParkingSlots = async (projectId: string, towerId: string, locationCode: string) => {
        setError(null);
        try {
            const { data, status: responseStatus, message }: any = await Api.get("crm_get_parking_slots", {
                project_id: projectId,
                tower_id: towerId,
                parking_location_code: locationCode
            });
            console.log("API Response:", { data, responseStatus, message });
            if (responseStatus) {
                setParkingSlots(data);
                console.log(data);
                setShowBookingPage(true);
            } else {
                setError('Failed to fetch parking slots');
            }
        } catch (error) {
            setError('An error occurred while fetching parking slots');
            console.error('Error fetching parking slots:', error);
        } 
    };

    const handleProjectChange = (event: SelectChangeEvent<string>) => {
        setSelectedProject(event.target.value);
        setSelectedTower('');
        setSelectedLocation('');
    };

    const handleTowerChange = (event: SelectChangeEvent<string>) => {
        setSelectedTower(event.target.value);
        setSelectedLocation('');
    };

    const handleLocationChange = (event: SelectChangeEvent<string>) => {
        setSelectedLocation(event.target.value);
    };

    const handleShowBookingPage = async () => {
        if (selectedProject && selectedTower && selectedLocation) {
            const selected = locations.find(
                item => item.project_id === selectedProject &&
                        item.tower_id === selectedTower &&
                        item.parking_location_code === selectedLocation
            );
            if (selected) {
                console.log(selected);
                setSelectedParkingLocation(selected);
                await fetchParkingSlots(selected.project_id, selected.tower_id, selected.parking_location_code);
            }
        }
    };

    // if (loading) {
    //     return <CircularProgress />;
    // }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    console.log(selectedParkingLocation);
    if (showBookingPage && selectedParkingLocation) {
        return (
            <SlotSelectionPage
                onActiveTab={() => setShowBookingPage(false)}
                index={0}
                parkingLocation={selectedParkingLocation}
                parkingSlots={parkingSlots}
                location_url={selectedParkingLocation?.location_url} 
            />
        );
    }

    return (
      <div className="basement-selections-page">
      <StyledHeading style={{ marginLeft: '20px'}}>
          Select Project, Tower, and Location
      </StyledHeading>
      <SelectionsContainer>
          <StyledFormControl style={{ marginLeft: '20px'}}>
              <InputLabel>Project</InputLabel>
              <Select value={selectedProject} onChange={handleProjectChange} label="Project">
                  {projects.map((project) => (
                      <MenuItem key={project.project_id} value={project.project_id}>
                          {project.project_name}
                      </MenuItem>
                  ))}
              </Select>
          </StyledFormControl>
  
          <StyledFormControl style={{ marginLeft: '20px'}}>
              <InputLabel>Tower</InputLabel>
              <Select value={selectedTower} onChange={handleTowerChange} label="Tower" disabled={!selectedProject}>
                  {towers.map((tower) => (
                      <MenuItem key={tower.tower_id} value={tower.tower_id}>
                          {tower.tower_name}
                      </MenuItem>
                  ))}
              </Select>
          </StyledFormControl>
  
          <StyledFormControl style={{ marginLeft: '20px'}}>
              <InputLabel>Location</InputLabel>
              <Select value={selectedLocation} onChange={handleLocationChange} label="Location" disabled={!selectedTower}>
                  {Array.isArray(locations) && locations.map((location) => (
                      <MenuItem key={location.parking_location_code} value={location.parking_location_code}>
                          {location.parking_location_name}
                      </MenuItem>
                  ))}
              </Select>
          </StyledFormControl>
  
          <Button 
              variant="contained" 
              color="primary" 
              onClick={handleShowBookingPage}
              disabled={!selectedProject || !selectedTower || !selectedLocation}
              style={{ marginLeft: '20px', padding: '10px 20px' }} // Add margin and padding to the button
          >
              Show Slot Selection Page
          </Button>
      </SelectionsContainer>
  </div>
    );
};

export default BasementSelectionsPage;