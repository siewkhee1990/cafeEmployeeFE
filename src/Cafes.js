import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Tab, Tabs, TextField, Snackbar, Alert } from "@mui/material";
import CafeService from "./cafeService";
import EmployeeService from "./employeeService";
import EmploymentService from "./employmentService";
import { useSelector, useDispatch } from "react-redux";
import { setCafeList } from "./slices/cafeSlice.js";

export function Cafes() {
  const navigate = useNavigate();
  const cafeDataList = useSelector((state) => state.cafe.cafeList);
  const dispatch = useDispatch();
  const [employeeRowData, setEmployeeRowData] = useState([]);
  const [tabList, setTabList] = useState(["list"]);
  const [currentTab, setCurrentTab] = useState("list");
  const [snackBarToggle, setSnackBarToggle] = useState(false);
  const [snackBarSeverity, setSnackBarSeverity] = useState("success");
  const [snackBarMsg, setSnackBarMsg] = useState("test");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [nameHelperText, setNameHelperText] = useState("");
  const [descriptionHelperText, setDescriptionHelperText] = useState("");
  const [locationHelperText, setLocationHelperText] = useState("");
  const [editCafeObject, setEditCafeObject] = useState({});
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [hasUpdate, setHasUpdate] = useState(false);

  const handleCafeDeleteButton = async (event) => {
    if (
      window.confirm(
        `are you sure to delete this cafe? cafe: ${event.data.name}, location: ${event.data.location}`
      )
    ) {
      const deletedResult = await CafeService.deleteCafe(event.data.id);
      if (deletedResult.status >= 400) {
        setSnackBarMsg(deletedResult.data.message);
        setSnackBarSeverity("error");
        setSnackBarToggle(true);
      } else {
        setSnackBarMsg(`cafe deleted`);
        setSnackBarSeverity("success");
        setSnackBarToggle(true);
        setCurrentTab("list");
        setHasUpdate(!hasUpdate);
      }
    }
  };
  const handleCafeEditButton = (event) => {
    setEditCafeObject(event.data);
    setEditName(event.data.name);
    setTabList(["list", `edit: ${event.data.no}`]);
    setCurrentTab(`edit: ${event.data.no}`);
  };
  const handleShowEmployeeList = (event) => {
    setEditCafeObject(event.data);
    setTabList([...tabList, `employee list: ${event.data.no}`]);
    setCurrentTab(`employee list: ${event.data.no}`);
  };
  const cafeButtonRenderer = (event) => {
    return (
      <div>
        <Button
          variant="outlined"
          color="warning"
          onClick={() => handleCafeEditButton(event)}
        >
          edit
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleShowEmployeeList(event)}
        >
          show employees
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleCafeDeleteButton(event)}
        >
          delete
        </Button>
      </div>
    );
  };

  const handleEmployeeRemoveButton = async (event) => {
    if (
      window.confirm(
        `Are you sure to remove this employee [employee name: ${event.data.employeeDetails.name}] from cafe [cafe name: ${event.data.cafe}]?`
      )
    ) {
      const deletedResult = await EmploymentService.removeEmployeeFromCafe(
        event.data._id
      );
      if (deletedResult.status >= 400) {
        setSnackBarMsg(deletedResult.data.message);
        setSnackBarSeverity("error");
        setSnackBarToggle(true);
      } else {
        setSnackBarMsg(`employee removed from cafe`);
        setSnackBarSeverity("success");
        setSnackBarToggle(true);
        setHasUpdate(!hasUpdate);
      }
    }
  };

  const employeeButtonHandler = (event) => {
    return (
      <div>
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleEmployeeRemoveButton(event)}
        >
          remove employee
        </Button>
      </div>
    );
  };

  const linkedTextRenderer = (event) => {
    return <a href="/employees">{event.value}</a>;
  };

  const [cafeColumnDefs] = useState([
    { field: "no", width: 75 },
    { field: "name", width: 120 },
    { field: "location", width: 120, filter: "agLocationFilter" },
    { field: "totalEmployees", width: 150 },
    {
      field: "action",
      width: 400,
      cellRenderer: cafeButtonRenderer,
    },
  ]);

  const [employeeColumnDefs] = useState([
    { field: "no", width: 75 },
    {
      field: "employeeDetails.name",
      headerName: "Name",
      width: 100,
      cellRenderer: linkedTextRenderer,
    },
    { field: "days_worked", headerName: "Days worked", width: 150 },
    { field: "employeeDetails.gender", headerName: "Gender", width: 100 },
    { field: "action", width: 200, cellRenderer: employeeButtonHandler },
  ]);

  useEffect(() => {
    getCafeData();
    getEmployeeList();
  }, [currentTab, hasUpdate]);

  useEffect(() => {
    setNameHelperText("");
    setDescriptionHelperText("");
    setLocationHelperText("");
    setName("");
    setDescription("");
    setLocation("");
  }, [currentTab]);

  useEffect(() => {
    const updateEdit = () => {
      if (editCafeObject && Object.keys(editCafeObject).length) {
        setEditName(editCafeObject.name);
        setEditDescription(editCafeObject.description);
        setEditLocation(editCafeObject.location);
        setEditId(editCafeObject.id);
      } else {
        setEditName("");
        setEditDescription("");
        setEditLocation("");
        setEditId("");
      }
    };
    updateEdit();
  }, [editCafeObject]);

  const getCafeData = async () => {
    const cafeData = await CafeService.getAllCafes();
    if (cafeData.status >= 400) {
      setSnackBarMsg(cafeData.data.message);
      setSnackBarSeverity("error");
      setSnackBarToggle(true);
    } else {
      const data = cafeData.data.data.map((element, index) => {
        return { ...element, no: index + 1 };
      });
      dispatch(setCafeList(data));
    }
  };

  const getEmployeeList = async () => {
    if (currentTab.includes("employee list")) {
      const employeeData = await EmployeeService.getAllEmployeesByCafeId(
        editCafeObject.id
      );
      if (employeeData.status >= 400) {
        setSnackBarMsg(employeeData.data.message);
        setSnackBarSeverity("error");
        setSnackBarToggle(true);
      } else {
        setEmployeeRowData(
          employeeData.data.data.map((element, index) => {
            return { ...element, no: index + 1 };
          })
        );
      }
    }
  };

  const changeTab = (event) => {
    if (event === "list") {
      setTabList(["list"]);
      setEditCafeObject({});
    }
    if (event === "create") {
      setTabList(["list", "create"]);
      setEditCafeObject({});
    }
    setCurrentTab(event);
  };

  const submitForm = async () => {
    const validForm = validateForm("new");
    if (validForm) {
      let result = await CafeService.createCafe({
        name,
        description,
        location,
      });
      if (result.status >= 400) {
        setSnackBarMsg(result.data.message);
        setSnackBarSeverity("error");
        setSnackBarToggle(true);
      } else {
        setSnackBarMsg(`cafe created`);
        setSnackBarSeverity("success");
        setSnackBarToggle(true);
        setTabList(["list"]);
        setCurrentTab("list");
      }
    }
  };

  const closeSnackBar = () => {
    setSnackBarToggle(false);
  };

  const validateForm = (type) => {
    let validName = false;
    let validDescription = false;
    let validLocation = false;
    let currentName;
    let currentDescription;
    let currentLocation;

    if (type === "change") {
      currentName = editName;
      currentDescription = editDescription;
      currentLocation = editLocation;
    }
    if (type === "new") {
      currentName = name;
      currentDescription = description;
      currentLocation = location;
    }

    if (!currentName || currentName.length < 6 || currentName.length > 10) {
      setNameHelperText(`name is required and length must be between 6 and 10`);
    } else {
      setNameHelperText(``);
      validName = true;
    }
    if (!currentDescription || currentDescription.length > 256) {
      setDescriptionHelperText(
        `description is required and length must not be more than 256`
      );
    } else {
      setDescriptionHelperText(``);
      validDescription = true;
    }
    if (
      !currentLocation ||
      currentLocation.length < 6 ||
      currentLocation.length > 10
    ) {
      setLocationHelperText(
        `location is required and length must be between 6 and 10`
      );
    } else {
      setLocationHelperText(``);
      validLocation = true;
    }
    if (validName && validDescription && validLocation) {
      return true;
    } else {
      return false;
    }
  };

  const submitChangesForm = async () => {
    const validForm = validateForm("change");
    if (validForm) {
      let result = await CafeService.updateCafe(editId, {
        name: editName,
        description: editDescription,
        location: editLocation,
      });
      if (result.status >= 400) {
        setSnackBarMsg(result.data.message);
        setSnackBarSeverity("error");
        setSnackBarToggle(true);
      } else {
        setSnackBarMsg(`cafe updated`);
        setSnackBarSeverity("success");
        setSnackBarToggle(true);
        setCurrentTab("list");
      }
    }
  };

  return (
    <div className="w-75 mx-auto">
      <div className="d-flex justify-content-between">
        <Button
          variant="outlined"
          color="warning"
          onClick={() => navigate("/")}
        >
          go back
        </Button>
        {currentTab && !currentTab.includes("create") && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => changeTab("create")}
          >
            Add New Café
          </Button>
        )}
      </div>
      <h1>Manage Cafes</h1>
      <Snackbar
        open={snackBarToggle}
        autoHideDuration={6000}
        onClose={closeSnackBar}
        message={snackBarMsg}
        severity={snackBarSeverity}
      >
        <Alert
          onClose={closeSnackBar}
          severity={snackBarSeverity}
          sx={{ width: "100%" }}
        >
          {snackBarMsg}
        </Alert>
      </Snackbar>
      <Tabs value={false}>
        {tabList && tabList.length
          ? tabList.map((element, index) => {
              return <Tab label={element} onClick={() => changeTab(element)} />;
            })
          : ""}
      </Tabs>
      {currentTab && currentTab === "list" && (
        <div className="ag-theme-alpine" style={{ width: 900, height: 500 }}>
          <AgGridReact
            rowData={cafeDataList}
            columnDefs={cafeColumnDefs}
          ></AgGridReact>
        </div>
      )}
      {currentTab && currentTab === "create" && (
        <div>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Cafe's Name"
            name="name"
            autoFocus
            onChange={(event) => {
              setName(event.target.value);
            }}
            helperText={nameHelperText}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Cafe's Description"
            name="description"
            autoFocus
            minRows="5"
            multiline="true"
            onChange={(event) => setDescription(event.target.value)}
            helperText={descriptionHelperText}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="location"
            label="Cafe's Location"
            name="location"
            autoFocus
            onChange={(event) => setLocation(event.target.value)}
            helperText={locationHelperText}
          />
        </div>
      )}
      {currentTab && currentTab.includes("edit") && (
        <div>
          <div>
            <TextField
              margin="normal"
              fullWidth
              id="name"
              label="Cafe's Name"
              name="name"
              autoFocus
              required
              onChange={(event) => {
                setEditName(event.target.value);
              }}
              value={editName}
              helperText={nameHelperText}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Cafe's Description"
              name="description"
              autoFocus
              minRows="5"
              multiline="true"
              onChange={(event) => setEditDescription(event.target.value)}
              value={editDescription}
              helperText={descriptionHelperText}
            />
            <TextField
              margin="normal"
              fullWidth
              id="location"
              label="Cafe's Location"
              name="location"
              autoFocus
              required
              onChange={(event) => setEditLocation(event.target.value)}
              value={editLocation}
              helperText={locationHelperText}
            />
          </div>
        </div>
      )}
      {currentTab && currentTab.includes("employee list") && (
        <div>
          <div>
            <TextField
              margin="normal"
              fullWidth
              id="name"
              label="Cafe's Name"
              name="name"
              autoFocus
              disabled
              value={editName}
              helperText={nameHelperText}
            />
            <TextField
              margin="normal"
              fullWidth
              id="location"
              label="Cafe's Location"
              name="location"
              autoFocus
              disabled
              value={editLocation}
              helperText={locationHelperText}
            />
            <div>
              Employee List
              <div
                className="ag-theme-alpine"
                style={{ width: "auto", height: 500 }}
              >
                <AgGridReact
                  rowData={employeeRowData}
                  columnDefs={employeeColumnDefs}
                  // onCellClicked={handleEmployeeTableCellClick}
                ></AgGridReact>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        {currentTab &&
          (!currentTab.includes("list") || !currentTab.startsWith("list")) && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => changeTab("list")}
            >
              Back to list
            </Button>
          )}
        {currentTab && currentTab.includes("create") && (
          <Button variant="outlined" color="primary" onClick={submitForm}>
            Create Cafe
          </Button>
        )}
        {currentTab && currentTab.includes("edit") && (
          <Button
            variant="outlined"
            color="primary"
            onClick={submitChangesForm}
          >
            Submit Changes
          </Button>
        )}
      </div>
    </div>
  );
}
