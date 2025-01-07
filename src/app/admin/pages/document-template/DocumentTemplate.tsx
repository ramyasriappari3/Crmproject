import React, { useEffect, useMemo, useState, useRef } from "react";
import { CKEditor, CKEditorEventHandler } from "ckeditor4-react";
import Api from "../../api/Api";
import Mustache from "mustache";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  FormControl,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { ENUMValues } from "@Src/utils/globalUtilities";
import { GridSearchIcon } from "@mui/x-data-grid";

const DocumentTemplate = () => {
  const editorRef: any = useRef(null);
  const [templateData, setTemplateData]: any = useState("");
  const [editor, setEditor]: any = useState(null);
  const [templateFormData, setTemplateFormData]: any = useState({
    project_id: "",
    document_type: "",
    template_content: "",
  });
  const [accessList, setAccessList]: any = useState({
    projectList: [],
    docTypeList: [],
  });
  const getDocumentType = async () => {
    const documentTypesList = await ENUMValues("doc_task_type_values");
    if (documentTypesList) {
      setAccessList((prevAccessList: any) => ({
        ...prevAccessList,
        docTypeList: documentTypesList,
      }));
    }
  };
  const getProjectList = async () => {
    const {
      data,
      status: responseStatus,
      message,
    }: any = await Api.get("crm_projects_list", {});
    if (responseStatus) {
      setAccessList((prevAccessList: any) => ({
        ...prevAccessList,
        projectList: data,
      }));
    }
  };

  const handleChange = (e: any) => {
    setTemplateFormData({
      ...templateFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChange = (e: any) => {
    //setTemplateData(e.editor.getData());
    setTemplateFormData({
      ...templateFormData,
      "template_content": e.editor.getData(),
    });
  };

  const handlePrint = () => {
    const editorIframe: any = document.querySelector(".cke_wysiwyg_frame");
    if (editorIframe) {
      editorIframe.contentWindow.focus();
      editorIframe.contentWindow.print();
    }
  };

  const handleFormSubmit = async () => {
    const formData = {
      project_id: templateFormData.project_id.project_id,
      template_content:  templateFormData.template_content,
      document_type: templateFormData.document_type,
    };
    const { data, status, message }: any = await Api.post("crm_create_doc_template", formData);
    if (status) {
      // Add success notification here if needed
    }
  };

  const editorConfig = {
    extraPlugins: "preview, print",
    versionCheck: false,
    on: {
      instanceReady: function (evt: any) {
        editorRef.current = evt.editor;
        setEditor(evt.editor);
        evt.editor.commands.print.exec = handlePrint;
      },
    },
  };

  const getTemplateInfo = async () => {
      const { data, status }: any = await Api.get("crm_doc_template_list", "");
      if (status && data?.[0]?.template_text_file) {
        const content = data[0].template_text_file;
        setTemplateData(content);
        setTemplateFormData({
          ...templateFormData,
          "template_content": content,
        });
        if (editor) {
          editor.setData(content);
        }
      }
  };

  // Initial load of template data
  useEffect(() => {
    getDocumentType();
    getProjectList();
    getTemplateInfo();
  }, []);

  useEffect(() => { 
    if (editor && templateData) {
      editor.setData(templateData);
    }
  }, [editor, templateData]);


  const firstName: any = "vinod inti";
  const lastName: any = "dhuni PVT";
  const names = [{ name: "Mustache" }, { name: "HandleBar" }];
  const dynamicFileHTML = useMemo(() => {
    return Mustache.render(templateData || "", { firstName, lastName, names });
  }, [templateData]);


  return (
    <>
      <div className="tw-p-1 tw-flex  tw-flex-col tw-gap-4 ">
        <div className="tw-flex tw-justify-between tw-p-3">
        <p className="tw-font-bold md:tw-block tw-hidden tw-text-xl tw-text-black">
          Document Template
        </p>
        
        
          <button
           style={{
            backgroundColor: "#000000",
            color: "#FFFFFF",
            border: "1px solid #000000",
            borderRadius: "5px",
            padding: "0.5rem",
            cursor: "pointer",
            width: '80px'
           }}
            onClick={handlePrint}
          >
            Print
          </button>

          {/* <div dangerouslySetInnerHTML={{ __html: dynamicFileHTML || "" }} /> */}
        </div>
        <div className="tw-bg-white" style={{borderRadius : '0.8rem',padding : '1.5rem'}}>
        <div className="tw-w-full ">
          <div className="tw-mb-1">
            <span className="red-star fs13 tw-text-red-500">*</span>
            <span className="fs13 text-pri-black">Project Name</span>
          </div>
          <FormControl className="tw-w-full">
            <Autocomplete
              id="country-select-demo"
              sx={{ width: 300 }}
              options={accessList.projectList}
              onChange={(event: any, newValue) => {
                let e = { target: { name: "project_id", value: newValue } };
                handleChange(e);
              }}
              // onBlur={(e: any) => {
              //   if (e != null) {
              //     handleChange(e);
              //   }
              // }}
              autoHighlight
              getOptionLabel={(option: any) => option.project_name}
              renderOption={(props: any, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box
                    key={key}
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...optionProps}
                  >
                    {option.project_name}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    style: { fontSize: "14px" },
                    startAdornment: (
                      <InputAdornment
                        className="tw-ml-2 tw-opacity-60"
                        position="start"
                      >
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Select or Search Project Name"
                  name="project_id"
                  //label="Choose project"
                />
              )}
            />
            {/* <p className='validation-msg'>{errorInfo?.project_id}</p> */}
          </FormControl>
        </div>

        <div className="tw-w-full">
          <div className="tw-mb-1">
            <span className="red-star fs13 tw-text-red-500">*</span>
            <span className="fs13 text-pri-black">Template Type</span>
          </div>
          <FormControl className="tw-w-full">
            <Autocomplete
              value={templateFormData.document_type}
              options={accessList.docTypeList.map(
                (option: any) => option.unnest
              )}
              onChange={(event: any, newValue) => {
                let e = { target: { name: "document_type", value: newValue } };
                handleChange(e);
              }}
              // onBlur={(e: any) => {
              //   if (e != null) {
              //     handleChange(e);
              //   }
              // }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    style: { fontSize: "14px" },
                    startAdornment: (
                      <InputAdornment
                        className="tw-ml-2 tw-opacity-60"
                        position="start"
                      >
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Select or Search Template type"
                  name="document_type"
                />
              )}
            />
            {/* <p className='validation-msg'>{errorInfo?.document_type}</p> */}
          </FormControl>
        </div>

        <div className="tw-w-full">
          <div className="tw-mb-1">
            <span className="red-star fs13 tw-text-red-500">*</span>
            <span className="fs13 text-pri-black">PAN Card</span>
          </div>
          <FormControl className="tw-w-full">
            <CKEditor
              ref={editorRef}
              data={templateFormData.template_content}
              config={editorConfig}
              onChange={handleOnChange}
            />
            {/* <p className='validation-msg'>{errorInfo?.pan_card}</p> */}
          </FormControl>
        </div>

        <div className="tw-flex tw-justify-center tw-pt-4">
          <button style={{
             backgroundColor: "#000000",
             color: "#FFFFFF",
             border: "1px solid #000000",
             borderRadius: "5px",
             padding: "0.5rem",
             cursor: "pointer",
             width: '150px',
          }} onClick={handleFormSubmit}>
          Save Template</button>
        </div>
        </div>
      </div>
    </>
  );
};

export default DocumentTemplate;
