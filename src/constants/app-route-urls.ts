export const AppRouteURls = {
  LOG_IN: `login`,
  MY_HOME: 'my-home',
  MY_APPLICATION_FORM: '/my-application-form/:customerId/:custUnitId',
  DASHBOARD: '/dashboard',
  MY_TASK: 'my-task-page',
  HOME_LOAN_PAGE: '/home-loan-page',
  MY_PROPERTY_DETAILS: 'my-property-details/unitId/:propertyId/:tabName?',
  TDS_INFO: '/tds-info/unitId/:propertyId/custUnitId/:cust_unit_id',
  HELP: '/help',
  MY_PROPERTY: 'my-property',
  BASEMENT_PAGE: '/car-parking-basement/:unitId/:optionId',
  BOOK_SLOTS: '/book-slots/:unitId',
  //Temporary Route To check UI
  APPLICATION_SUBMITTED: '/application-submitted',
  TERMS_AND_CONDITIONS: '/terms-and-conditions',
  FORGET_PASSWORD: '/forget-password',
  RESET_PASSWORD: '/reset-password/:token',
  MY_ACCOUNT_VIEW: '/myAccount/view',
  PAYMENTS_TAB: '/payments-tab',
  CUSTOMER_PAYMENTS_PROOF: '/payments-proof/:cust_unit_id/:cust_profile_id',
  TEST: '/testPdf',
  PARKING: '/parking',
  PARKING_TOWERS: '/parking/:project_id',
  PARKING_BASIS:'/parking/:project_id/:tower-id',
  PARKING_FLAT_RANGE: '/parking/:project_id/:tower-id/:basis_of_no_of_eligible_car_parking',
  PARKING_FLOOR_RANGE: '/parking/:project_id/:tower-id/:basis_of_no_of_eligible_car_parking/:flat_range/:no_of_car_parkings/:allocation_basis',
  PARKING_OPTIONS: '/parking/:project_id/:tower-id/:basis_of_no_of_eligible_car_parking/:flat_range/:no_of_car_parkings/:allocation_basis/:floor_range/:allocation_location',
  PARKING_LOCATIONS: '/parking/:project_id/:tower-id/:basis_of_no_of_eligible_car_parking/:flat_range/:no_of_car_parkings/:allocation_basis/:floor_range/:allocation_location/:option'
};