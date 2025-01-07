import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import userSessionInfo from "../../util/userSessionInfo";
import Api from "../../api/Api";

interface DocumentTemplate {
  document_template_id: string;
  project_id: string;
  template_text_file: string;
  template_content: string;
  created_on: string;
  created_by: string;
  last_modified_by: string;
  last_modified_date: string;
  is_active: boolean;
  approved_by: string | null;
  document_type: string;
  file_name: string;
  document_status: string | null;
  rejected_reasons: string;
  project_name: string;
  approval_info: Array<{ approved_by: string }>;
}

export default function PdfTemplate() {
  const [tempdata, setTempData] = useState<DocumentTemplate[]>([]);
  const [openPdf, setOpenPdf] = useState(false);
  const [pdfContent, setPdfContent] = useState<string>("");
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [personnelDetails, setPersonalDetails] = useState<any>();
  const personnelDetailsInfo = userSessionInfo.logPersonnelDetailsInfo();
  const [isTopHierarchy, setIsTopHierarchy] = useState(false);
  const fetchTempData = async () => {
    try {
      const response = await Api.get("crm_doc_template_list", {});
      if (response.status && response.data && response.data.length > 0) {
        console.log(response.data);
        setTempData(response.data);
      } else {
        console.error("Failed to fetch Template Data:", response.message);
      }
    } catch (error) {
      console.error("Error fetching Template Data:", error);
    }
  };


  const fetchHeirarchyPersonnalDetails = async () => {
    try {
      const response = await Api.get("crm_get_heirachy_personal_details", {
        superior_id: personnelDetailsInfo.personnel_id
      });
      if (response.status && response.data && response.data.length > 0) {
        console.log(response.data);
        setPersonalDetails(response.data[0]);
      } else {
        console.error("Failed to fetch PersonalDetails Data:", response.message);
        setIsTopHierarchy(true);
      }
    } catch (error) {
      console.error("Error fetching PersonalDetails Data:", error);
    }
  };

  useEffect(() => {
    fetchTempData();
    fetchHeirarchyPersonnalDetails();
  }, []);


  const canViewDocument = (item: DocumentTemplate) => {
    const approvalInfo = item.approval_info || [];
    console.log("Approval Info:", approvalInfo);
    const personnelCode = personnelDetails?.personnel_code;
    console.log(personnelCode);

    if (isTopHierarchy) {
      console.log("RM Manager is at the top of hierarchy and can view documents.");
      return true;
    } else {
      // Step 1: Filter approvalInfo to find approvals by the logged-in user (personnelCode)
      const userApprovals = approvalInfo
        .filter((info: { approved_by: string }) => info.approved_by === personnelCode)
        .map(info => ({
          ...info,
          // additional transformations if needed
        }));

      console.log("User Approvals after filtering:", userApprovals);

      // Step 2: Check if any of these approvals have `approved_by` equal to `personnelCode`
      const hasPersonnelCodeApproval = userApprovals.length > 0;
      console.log("Has personnel code approval:", hasPersonnelCodeApproval);

      return hasPersonnelCodeApproval;
    }
  };


  const handleView = (item: DocumentTemplate) => {
    setPdfContent(item.template_text_file);
    setOpenPdf(true);
  };

  const handleApproveClick = (document_template_id: string) => {
    setSelectedDocumentId(document_template_id);
    setOpenApproveDialog(true);
  };

  const onApprove = async () => {
    if (!selectedDocumentId){
      return;
    } 
    const document = tempdata.find((doc) => doc.document_template_id === selectedDocumentId);
    if (!document) {
      return;
    }

    const payload = {
      project_id: document.project_id,
      template_content: document.template_content,
      document_type: document.document_type,
      document_template_id: document.document_template_id,
      document_status: "Approved",
      created_by:document.created_by,
      rejected_reasons: "",
    };

    try {
      const response = await Api.post("crm_update_document_template", payload);
      console.log("Approval successful", response.data);
      setOpenApproveDialog(false);
      fetchTempData();
    } catch (error) {
      console.error("Approval failed", error);
    }
  };

  const handleRejectClick = (document_template_id: string) => {
    setSelectedDocumentId(document_template_id);
    setOpenRejectDialog(true);
  };

  const onReject = async () => {
    if (!selectedDocumentId || !rejectionReason) {
      return;
    } 
    const document = tempdata.find((doc) => doc.document_template_id === selectedDocumentId);
    if (!document){
      return;
    } 

    const payload = {
      project_id: document.project_id,
      template_content: document.template_content,
      document_type: document.document_type,
      document_template_id: document.document_template_id,
      created_by:document.created_by,
      document_status: "Reject",
      rejected_reasons: rejectionReason,
    };

    try {
      const response = await Api.post("crm_update_document_template", payload);
      console.log("Rejection successful", response.data);
      setOpenRejectDialog(false);
      setRejectionReason("");
      fetchTempData();
    } catch (error) {
      console.error("Rejection failed", error);
    }
  };


  const ActionDisable = (item: any) => {
    const approvalInfo = item.approval_info || [];
    const userInfo = userSessionInfo.logUserInfo();
    
    // Check if the logged-in user has already approved the document
    const userHasApproved = approvalInfo.some((info: { approved_by: string }) => 
        info.approved_by === userInfo.user_login_name
    );

    console.log("User Approval Status:", userHasApproved);
    return userHasApproved;
};


  return (
    <>
      <div>
        <h2 className="Application_header tw-font-bold tw-text-black tw-ml-3" style={{ marginLeft: "1rem", marginTop: "6rem" }}>
          PDF Templates
        </h2>
      </div>
      <div>
        <TableContainer component={Paper} style={{ overflowX: "auto", borderRadius: "0.5rem" }}>
          <Table aria-label="simple table">
            <TableHead className="tw-bg-gray-200">
              <TableRow>
                <TableCell style={{ paddingLeft: "5rem" }}>Project Name</TableCell>
                <TableCell>Document Status</TableCell>
                <TableCell>Document Type</TableCell>
                <TableCell>Approved By</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tempdata.length > 0 ? (
                tempdata
                  .filter(canViewDocument)
                  .map((item: DocumentTemplate, index: number) => (
                    <TableRow key={index}>
                      <TableCell style={{ paddingLeft: "5rem" }}>{item.project_name}</TableCell>
                      <TableCell>{item.document_status ?? "N/A"}</TableCell>
                      <TableCell>{item.document_type}</TableCell>
                      <TableCell>{item.approved_by}</TableCell>
                      <TableCell>{item.created_by}</TableCell>
                      <TableCell>
                        <Button variant="outlined" color="primary" onClick={() => handleView(item)}>
                          View
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleApproveClick(item.document_template_id)}
                          style={{ marginLeft: "0.5rem" }}
                          disabled={ActionDisable(item)} // Disable if user has approved
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleRejectClick(item.document_template_id)}
                          style={{ marginLeft: "0.5rem" }}
                          disabled={ActionDisable(item)} // Disable if user has approved
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: "center" }}>
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* PDF Viewer Dialog */}
      <Dialog open={openPdf} onClose={() => setOpenPdf(false)} maxWidth="md" fullWidth>
        <DialogTitle>PDF Content</DialogTitle>
        <DialogContent>
          <iframe src={pdfContent} width="100%" height="600px" title="PDF Viewer"></iframe>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPdf(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)}>
        <DialogTitle>Approve Document</DialogTitle>
        <DialogContent>
          Are you sure you want to approve this document?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApproveDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={onApprove} color="primary">
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)}>
        <DialogTitle>Reject Document</DialogTitle>
        <DialogContent>
          <TextField
            label="Rejection Reason"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={onReject} color="primary">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
