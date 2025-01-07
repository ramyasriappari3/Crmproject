import { lazy, LazyExoticComponent } from "react";
import AdminLayout from "../layout/AdminLayout";
import lazyWithRetry from "../util/lazyWithRetry";

// Define types/interfaces
interface RouteItem {
  path: string;
  exact: boolean;
  roles: string[];
  accessLevel: string;
  element: LazyExoticComponent<React.ComponentType<any>>;
}

interface RouteConfig {
  RouteLayout: React.ReactNode;
  ProtectRoute: boolean;
  RouteList: RouteItem[];
}

// Define your route configurations
const RoutersList: RouteConfig[] = [
  {
    RouteLayout: "",
    ProtectRoute: true,
    RouteList: [
      {
        path: "/crm/*",
        exact: true,
        roles: [],
        accessLevel: "",
        element: lazyWithRetry(() => import("../components/common/PageNotFound")),
      },
      {
        path: "/crm/login",
        exact: true,
        roles: [],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/auth/AdminLogin")),
      },
      {
        path: "/crm/admin/login",
        exact: true,
        roles: [],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/auth/AdminLogin")),
      },
      {
        path: "/crm/forgotpassword",
        exact: true,
        roles: [],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/auth/ForgotPassword")),
      },
      {
        path: "/crm/reset-password/:token",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/reset-password/ResetPassword")),
      },

      // Add more route items as needed
      //   {
      //       path: '/createcampaign',
      //       exact: true,
      //       roles: ["Creator", "Approver"],
      //       accessLevel: '',
      //         element: lazy(() => import('../../components/auth/Registration'))
      //   },
    ],
  },
  {
    RouteLayout: <AdminLayout />,
    ProtectRoute: true,
    RouteList: [
      {
        path: "/crm/admin/templateapproval",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/templates/Template")),
      },
      {
        path: "/crm/dashboard",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/dashboard/Dashboard")),
      },
      {
        path: "/crm/customerslist",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/onboard-customers/OnboardCustomers")
        ),
      },
      {
        path: "/crm/application/:customerId/:custUnitId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/application/Application")),
      },
      {
        path: "/crm/applicationinformation",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/applicant-information/ApplicationInformation")
        ),
      },

      {
        path: "/crm/applicationdefault/:customerId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/applicationformdetails/ApplicationDefault")
        ),
      },
      {
        path: "/crm/completeverification",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/applicationformdetails/CompleteVerification")
        ),
      },

      {
        path: "/crm/purchaserdetails",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/purchaser-details/PurchaserDetails")
        ),
      },
      {
        path: "/crm/purchaserdocuments",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/purchaser-documents/PurchaserDocument")
        ),
      },
      {
        path: "/crm/managecustomer",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/manage-customer/ManagerCustomer")),
      },
      {
        path: "/crm/managecustomerdetails/:customerId/:custUnitId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/booking-details-tab/BookingDetails")
        ),
      },
      {
        path: '/crm/admin/managecarparking',
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: '',
        element: lazyWithRetry(() => import('../pages/manage car-parking/ManageCarParking'))
      },
      {
        path: '/crm/managecarparkingdetails/:customerId/:custUnitId',
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: '',
        element: lazyWithRetry(() => import('@Pages/car-parking-home-page/book-slots/BookSlots'))
      },
      {
        path: '/crm/managecarparkingdetails/basement-slot-selection', // Dynamic route
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: '',
        element: lazyWithRetry(() => import('@Pages/car-parking-home-page/car-parking-booking-page/BookSlotsPage'))
      },
      // {
      //   path: '/crm/managecarparkingdetails/slot-selection',
      //   exact: true,
      //   roles: ["User", "Creator", "Approver"],
      //   accessLevel: '',
      //   element: lazy(() => import('@Pages/car-parking-home-page/car-parking-booking-page/BookSlotsPage'))
      // },
      // {
      //   path: '/crm/managecarparkingdetails/slot-selections',
      //   exact: true,
      //   roles: ["User", "Creator", "Approver"],
      //   accessLevel: '',
      //   element: lazy(() => import('@Pages/car-parking-home-page/car-parking-booking-page/BookSlotsPage'))
      // },
      {
        path: '/crm/managecarparkingdetails/slot-selections/success',
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: '',
        element: lazyWithRetry(() => import('@Pages/car-parking-home-page/car-parking-success/CarParkingSuccessPage'))
      },
      {
        path: "/crm/viewmilestones",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/view-milestones/ViewMilestones")),
      },
      {
        path: "/crm/tasks",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/tasks-tab/Tasks")),
      },
      {
        path: "/crm/sendlogincredentials",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/send-login-credentials/SendLoginCredentials")
        ),
      },

      {
        path: "/crm/assigntask",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/assign-task/AssignTask")),
      },

      {
        path: "/crm/viewpaymentproof",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/view-payment-proof/ViewPaymentProof")
        ),
      },
      {
        path: "/crm/paymentproofs/:customerId/:custUnitId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/payment-proofs/PaymentProofs")),
      },

      {
        path: "/crm/tdsdetails/:customerId/:custUnitId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/tds-details/TdsDetails")),
      },
      {
        path: "/crm/tdsdetails/:customerId/:custUnitId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/tds-details/TdsDetails")),
      },
      {
        path: "/crm/applicationformdetails/:customerId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () =>
            import("../pages/applicationformdetails/ApplicationFormDetailes")
        ),
      },
      {
        path: "/crm/sentapplication",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/sent-application/SentApplication")
        ),
      },
      {
        path: "/crm/receipts/:customerId/:custUnitId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/receipts/Receipts")),
      },
      {
        path: "/crm/myaccount",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/my-account-page/MyAccount")),
      },
      {
        path: "/crm/parking",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/parking-rules/ProjectContainer")),
      },
      {
        path: "/crm/documenttemplate",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/document-template/DocumentTemplate")),
      },
      {
        path: "/crm/parking/:project_id",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/parking-rules/TowersContainer")),
      },
      {
        path: "/2/crm/parking/:project_id/:tower_id",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/parking-rules/BasisEligibilityContainer")
        ),
      },
      {
        path: "/crm/parking/:project_id/:tower_id",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/parking-rules/ParkingRules")
        ),
      },
      {
        path: "/crm/parking/:project_id/:tower_id/:basis_of_no_of_eligible_car_parking",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/parking-rules/FlatRangeContainer")
        ),
      },
      // {
      //   path: "/crm/parking/:project_id/:tower_id/:basis_of_no_of_eligible_car_parking",
      //   exact: true,
      //   roles: ["User", "Creator", "Approver"],
      //   accessLevel: "",
      //   element: lazy(
      //     () => import("../pages/parking-rules/ParkingRules")
      //   ),
      // },
      {
        path: "/crm/parking/:project_id/:tower_id/:basis_of_no_of_eligible_car_parking/:flat_range/:no_of_car_parkings/:allocation_basis",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/parking-rules/FloorRangeContainer")
        ),
      },
      {
        path: "/crm/parking/:project_id/:tower_id/:basis_of_no_of_eligible_car_parking/:flat_range/:no_of_car_parkings/:allocation_basis/:floor_range/:allocation_location",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/parking-rules/OptionsContainer")),
      },
      {
        path: "/crm/parking/:project_id/:tower_id/:basis_of_no_of_eligible_car_parking/:flat_range/:no_of_car_parkings/:allocation_basis/:floor_range/:allocation_location/:option",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/parking-rules/LocationAllocationContainder")
        ),
      },
      // {
      //   path: '/crm/*',
      //   exact: true,
      //   roles: ["User", "Creator", "Approver"],
      //   accessLevel: '',
      //   element: lazy(() => import('../components/common/PageNotFound'))
      // },
    ],
  },
  {
    RouteLayout: <AdminLayout />,
    ProtectRoute: true,
    RouteList: [
      {
        path: "/crm/admin/dashboard",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/dashboard/Dashboard")),
      },
      {
        path: "/crm/admin/customerslist",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/onboard-customers/OnboardCustomers")
        ),
      },
      {
        path: "/crm/admin/application/:customerId/:custUnitId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/application/Application")),
      },
      {
        path: "/crm/admin/applicationinformation",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/applicant-information/ApplicationInformation")
        ),
      },

      {
        path: "/crm/admin/applicationdefault/:customerId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/applicationformdetails/ApplicationDefault")
        ),
      },
      {
        path: "/crm/admin/completeverification",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/applicationformdetails/CompleteVerification")
        ),
      },

      {
        path: "/crm/admin/purchaserdetails",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/purchaser-details/PurchaserDetails")
        ),
      },
      {
        path: "/crm/admin/purchaserdocuments",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/purchaser-documents/PurchaserDocument")
        ),
      },
      {
        path: "/crm/admin/managecustomer",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/manage-customer/ManagerCustomer")),
      },
      {
        path: "/crm/admin/managecustomerdetails/:customerId/:custUnitId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/booking-details-tab/BookingDetails")
        ),
      },

      {
        path: "/crm/admin/viewmilestones",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/view-milestones/ViewMilestones")),
      },
      {
        path: "/crm/admin/tasks",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/tasks-tab/Tasks")),
      },
      {
        path: "/crm/admin/sendlogincredentials",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/send-login-credentials/SendLoginCredentials")
        ),
      },

      {
        path: "/crm/admin/assigntask",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/assign-task/AssignTask")),
      },

      {
        path: "/crm/admin/viewpaymentproof",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/view-payment-proof/ViewPaymentProof")
        ),
      },
      {
        path: "/crm/admin/paymentproofs/:customerId/:custUnitId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/payment-proofs/PaymentProofs")),
      },

      {
        path: "/crm/admin/tdsdetails/:customerId/:custUnitId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/tds-details/TdsDetails")),
      },
      {
        path: "/crm/admin/tdsdetails/:customerId/:custUnitId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/tds-details/TdsDetails")),
      },
      {
        path: "/crm/admin/applicationformdetails/:customerId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () =>
            import("../pages/applicationformdetails/ApplicationFormDetailes")
        ),
      },
      {
        path: "/crm/admin/sentapplication",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/sent-application/SentApplication")
        ),
      },
      {
        path: "/crm/admin/receipts/:customerId/:custUnitId",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/receipts/Receipts")),
      },
      {
        path: "/crm/admin/myaccount",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/my-account-page/MyAccount")),
      },
      {
        path: "/crm/admin/faq",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/faq/FAQ")),
      },
      {
        path: "/crm/admin/admin-portal",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/admin-portal/AdminPortal")),
      },
      {
        path: "/crm/admin/constructionupdates",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/construction_updates/ConstructionUpdates")
        ),
      },
      {
        path: "/crm/admin/faqpopup",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/faq/FAQ")),
      },
      {
        path: '/crm/admin/projectimages',
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: '',
        element: lazyWithRetry(() => import('../pages/project-images/ProjectImages'))
      },
      {
        path: '/crm/admin/advertisement',
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: '',
        element: lazyWithRetry(() => import('../pages/advertisements/AdminAdvertisements'))
      },
      {
        path: '/crm/admin/marketingimages',
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: '',
        element: lazyWithRetry(() => import('../pages/marketing-images/MarketingImages'))
      },
      {
        path: '/crm/admin/termsandconditions',
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: '',
        element: lazyWithRetry(() => import('../pages/terms/Terms'))
      },
      {
        path: '/crm/admin/projectlogo',
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: '',
        element: lazyWithRetry(() => import('../pages/project-logo/ProjectLogo'))
      },
      {
        path: '/crm/admin/tdsinfo',
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: '',
        element: lazyWithRetry(() => import('../pages/tds_info/tds_info'))
      },
      {
        path: '/crm/admin/carparking',
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: '',
        element: lazyWithRetry(() => import('../pages/car-parking-pages/BasementSelectionPage'))
      },
      {
        path: "/crm/admin/templates",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/document-templates/DocTemplates")),
      },
      {
        path: "/crm/admin/parking",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/parking-rules/ProjectContainer")),
      },
      {
        path: "/crm/admin/parking/:project_id",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/parking-rules/TowersContainer")),
      },
      {
        path: "/crm/admin/parking/:project_id/:tower_id/versions",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/parking-rules/RuleVersions")
        ),
      },
      {
        path: "/crm/admin/parking/:project_id/:tower_id",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/parking-rules/ParkingRules")
        ),
      },
      {
        path: "/crm/admin/parking/:project_id/:tower_id/:rule_id",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(
          () => import("../pages/parking-rules/ParkingRules")
        ),
      },
      {
        path: "/crm/admin/documenttemplate",
        exact: true,
        roles: ["User", "Creator", "Approver"],
        accessLevel: "",
        element: lazyWithRetry(() => import("../pages/document-template/DocumentTemplate")),
      },

    ]
  }
];

export { RoutersList };
