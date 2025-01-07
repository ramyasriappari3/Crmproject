import React, { useState, useEffect } from "react";
import { GridFilterModel } from "@mui/x-data-grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./PaymentProofs.scss";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Api from "../../api/Api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { hideSpinner, showSpinner } from "@Src/features/global/globalSlice";
import { useAppDispatch } from "@Src/app/hooks";
import { Dialog } from "@mui/material";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import {
  formatNumberToIndianSystem,
  getDateFormateFromTo,
  last_modifiedformatExactDateTime,
  formatExactDate
} from "@Src/utils/globalUtilities";
import BookingDetails from "../booking-details-tab/BookingDetails";
import { useLocation } from "react-router-dom";
import ViewMilestones from "../view-milestones/ViewMilestones";


interface PaymentProofs {
  document_identifier: string;
  cust_unit_id: string;
  document_name: string;
  document_type: string;
  document_number: string;
  document_url: string;
  created_on: string;
  last_modified_by: string | null;
  payment_type: string;
  amount: string;
  payment_date: any;
  reconciled: boolean;
  last_modified_at:string | null
}

function PaymentProofs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerId } = useParams();
  const { custUnitId } = useParams();
  const dispatch = useAppDispatch();
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
  });
  const [PaymentProofs, setPaymentProofs] = useState<PaymentProofs[]>([]);
  const [updateReconciled, setUpdateReconclied] = useState(false);
  const [customerPaymentObj, setCustomerPaymentObj] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [viewPaymentProof, setViewPaymentProof] = useState<any>({});
  const [viewPaymentProofModel, setPaymentProofModel] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<any>({});

  const customerPaymentProofs = async () => {
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.get("crm_payment_proofs", {
      cust_unit_id: custUnitId,
      cust_profile_id: customerId,
    });
    dispatch(showSpinner());
    if (responseStatus) {
      setPaymentProofs(data?.paymentProofsData);
      setCustomerDetails(data?.customerDetails);
      setIsLoading(true);
    } else {
      setPaymentProofs([]);
      setIsLoading(true);
    }
    dispatch(hideSpinner());
  };

  const updateReconciledAPI = async (
    updateReconciled: any,
    customerPaymentObj: any
  ) => {
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.post("crm_update_payment_reconclied", {
      document_identifier: customerPaymentObj?.document_identifier,
      reconciled: updateReconciled,
    });
    // console.log(responseStatus,data)
    dispatch(showSpinner());
    if (responseStatus) {
      toast.success(message);
      setPaymentProofs((prevState) =>
        prevState.map((proof) =>
          proof.document_identifier === customerPaymentObj?.document_identifier
            ? { ...proof, reconciled: updateReconciled }
            : proof
        )
      );
    } else {
      toast.error(message);
    }
    dispatch(hideSpinner());
  };

  useEffect(() => {
    customerPaymentProofs();
  }, [updateReconciled]);

  console.log("PaymentProofs", PaymentProofs);
  // console.log("isLoading",isLoading)

  const handleReconciliationChange = async (
    document_identifier: string,
    event: React.ChangeEvent<HTMLSelectElement>,
    row: any
  ) => {
    const value = event.target.value === "yes";
    // console.log("valuee",value)
    setUpdateReconclied(value);
    updateReconciledAPI(value, row);
  };

  const handleBackToGrid = () => {
    navigate(`/crm/managecustomerdetails/${customerId}/${custUnitId}`, {
      state: { viewMilestonesTab: true, currentTab: 2 },
    });
  };

  return (
    <>
      <div style={{ width: "95%", margin: "2rem" }}>
        <div className="tw-pr-3">
          <Button onClick={() => handleBackToGrid()} style={{ color: "black" }}>
            <ArrowBackIcon color="inherit" />
          </Button>
          <span className="tw-font-bold tw-text-black">
            Manage Customers / {customerDetails?.full_name}{" "}
          </span>
          <span style={{ color: "#656C7B" }}>/ Payment Proofs</span>
        </div>
        <div>
          <h2
            className="tw-font-bold tw-text-black tw-mb-2 tw-ml-5"
            style={{ fontSize: "1.5em" }}
          >
            Payment Proofs
          </h2>
        </div>
        {PaymentProofs.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead className="tw-bg-gray-200">
                <TableRow>
                  <TableCell align="center">Amount Paid</TableCell>
                  <TableCell align="center">Payment date</TableCell>
                  <TableCell align="center">UTR / Cheque No.</TableCell>
                  <TableCell align="center">Date uploaded</TableCell>
                  <TableCell align="center">
                    Reconciliation Done{" "}
                    <ArrowDownwardIcon
                      style={{ color: "989FAE", marginLeft: "3rem" }}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {PaymentProofs.map((row: PaymentProofs, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        backgroundColor: "#F8F9FD",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                      onClick={() => {
                        setPaymentProofModel(true);
                        setViewPaymentProof(row);
                      }}
                    >
                      <p> ₹{formatNumberToIndianSystem(row?.amount)}</p>
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => {
                        setPaymentProofModel(true);
                        setViewPaymentProof(row);
                      }}
                    >
                      <p>{formatExactDate(row?.payment_date)}</p>
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => {
                        setPaymentProofModel(true);
                        setViewPaymentProof(row);
                      }}
                    >
                      {row?.document_number}
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => {
                        setPaymentProofModel(true);
                        setViewPaymentProof(row);
                      }}
                    >
                      {last_modifiedformatExactDateTime(row?.last_modified_at)}
                    </TableCell>
                    <TableCell align="center">
                      <select
                        value={row?.reconciled ? "yes" : "no"}
                        onChange={(event) =>
                          handleReconciliationChange(
                            row.document_identifier,
                            event,
                            row
                          )
                        }
                        style={{
                          border: "1px solid #989FAE",
                          padding: "4px 8px",
                          borderRadius: "8px",
                          width: "198.4px",
                          height: "32px",
                        }}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          isLoading && (
            <div className="no-payment-proofs">
              <img
                src={
                  "https://real-estate-crm-documents.s3.ap-south-1.amazonaws.com/static_icons/no-payment-red-rubber-stamp-vector-illustration_545399-3701.avif"
                }
                alt="No Payment Proofs"
                className="no-payment-proofs-image"
              />
              <p className="no-payment-proofs-text">
                No Payment Proofs Available
              </p>
            </div>
          )
        )}
      </div>

      <Dialog
        open={viewPaymentProofModel}
        onClose={() => {
          setPaymentProofModel(false);
          setViewPaymentProof({});
        }}
      >
        <div className="tw-flex tw-justify-between tw-m-5">
          <h3 className="tw-font-bold tw-text-2xl tw-mr-1">Payment Proof</h3>
          <img
            src="/images/cross-icon.svg"
            className="tw-cursor-pointer"
            onClick={() => {
              setPaymentProofModel(false);
              setViewPaymentProof({});
            }}
          />
        </div>

        <div className="tw-flex tw-justify-between">
          <div className="tw-ml-2">
            <p className="tw-ml-2.5">{formatExactDate(viewPaymentProof?.payment_date)}</p>
            <Typography variant="h6" gutterBottom>
              <p className="tw-font-bold tw-text-black tw-ml-2">
                {" "}
                ₹{formatNumberToIndianSystem(viewPaymentProof?.amount)}
              </p>
            </Typography>
          </div>
          <div>
            <p className="tw-mr-5"> UTR / Cheque No.</p>
            <p className="tw-text-black tw-font-bold">
              {viewPaymentProof?.document_number}
            </p>
          </div>
        </div>
        <Box
          sx={{
            padding: "50px",
            borderRadius: "8px",
            textAlign: "center",
            height: "875px",
            width: "580px",
            backgroundColor: "#EAECEF",
          }}
        >
          <div className="tw-bg-black tw-h-full">
            {viewPaymentProof?.document_url?.endsWith(".pdf") ? (
              <iframe
                src={viewPaymentProof?.document_url}
                title="Payment Proof PDF"
                width="100%"
                height="100%"
                style={{ border: "none" }}
              />
            ) : (
              <img src={viewPaymentProof?.document_url} alt="Payment Proof" />
            )}
          </div>
        </Box>
      </Dialog>
    </>
  );
}

export default PaymentProofs;
