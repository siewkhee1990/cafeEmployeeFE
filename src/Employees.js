import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  Button,
  Tab,
  Tabs,
  TextField,
  Snackbar,
  Alert,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CafeService from "./cafeService";
import EmployeeService from "./employeeService";
import EmploymentService from "./employmentService";
import { useSelector, useDispatch } from "react-redux";
import { setEmployeeList } from "./slices/employeeSlice.js";
import { setCafeList } from "./slices/cafeSlice.js";

export function Employees() {
  const navigate = useNavigate();
  const employeeDataList = useSelector((state) => state.employee.employeeList);
  const employeeEditList = useSelector((state) => state.employee.editData);
  const cafeDataList = useSelector((state) => state.cafe.cafeList);
  const dispatch = useDispatch();
  const [tabList, setTabList] = useState(["list"]);
  const [currentTab, setCurrentTab] = useState("list");
  const [snackBarToggle, setSnackBarToggle] = useState(false);
  const [snackBarSeverity, setSnackBarSeverity] = useState("success");
  const [snackBarMsg, setSnackBarMsg] = useState("test");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [gender, setGender] = useState("");
  const [assignCafe, setAssignCafe] = useState("");
  const [nameHelperText, setNameHelperText] = useState("");
  const [emailHelperText, setEmailHelperText] = useState("");
  const [phoneNumHelperText, setPhoneNumHelperText] = useState("");
  const [genderHelperText, setGenderHelperText] = useState("");
  const [assignCafeHelperText, setAssignCafeHelperText] = useState("");
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhoneNum, setEditPhoneNum] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editAssignCafe, setEditAssignCafe] = useState("");
  const [hasUpdate, setHasUpdate] = useState(false);
  const [cafeSelectList, setCafeSelectList] = useState([]);
  const [editEmployeeObject, setEditEmployeeObject] = useState({});

  async function handleEmployeeDeleteButton(event) {
    if (
      window.confirm(
        `are you sure to delete this employee? name: ${event.data.name}`
      )
    ) {
      const deletedResult = await EmployeeService.deleteEmployee(event.data.id);
      if (deletedResult.status >= 400) {
        setSnackBarMsg(deletedResult.data.message);
        setSnackBarSeverity("error");
        setSnackBarToggle(true);
      } else {
        setSnackBarMsg(`employee deleted`);
        setSnackBarSeverity("success");
        setSnackBarToggle(true);
        setCurrentTab("list");
        setHasUpdate(!hasUpdate);
      }
    }
  }
  function handleEmployeeEditButton(event) {
    setEditEmployeeObject(event.data);
    setTabList(["list", `edit: ${event.data.id}`]);
    setCurrentTab(`edit: ${event.data.no}`);
  }
  function handleAssignCafeButton(event) {
    setEditEmployeeObject(event.data);
    setTabList(["list", `assign cafe: ${event.data.id}`]);
    setCurrentTab(`assign cafe: ${event.data.id}`);
  }
  function employeeButtonRenderer(event) {
    return (
      <div>
        <Button
          variant="outlined"
          color="warning"
          onClick={() => handleEmployeeEditButton(event)}
        >
          edit
        </Button>
        {!event.data.cafe && !event.data.currentAssignment && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleAssignCafeButton(event)}
          >
            assign cafe
          </Button>
        )}
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleEmployeeDeleteButton(event)}
        >
          delete
        </Button>
      </div>
    );
  }
  function handleEmployeeAssignCafeButton(event) {
    console.log(999);
    console.log(event);
    console.log(event.data.id);
    console.log(employeeEditList);
    console.log(tabList);
    console.log("editEmployeeObject: ", editEmployeeObject);
    // if (
    //   window.confirm(
    //     `Are you sure to assign this employee to cafe [cafe name: ${event.data.name}]?`
    //   )
    // ) {
    //   const assignedResult = await EmploymentService.assignEmployeeToCafe(
    //     editId,
    //     event.data.id
    //   );
    //   if (assignedResult.status >= 400) {
    //     setSnackBarMsg(assignedResult.data.message);
    //     setSnackBarSeverity("error");
    //     setSnackBarToggle(true);
    //   } else {
    //     setSnackBarMsg(`employee assigned to cafe`);
    //     setSnackBarSeverity("success");
    //     setSnackBarToggle(true);
    //     setHasUpdate(!hasUpdate);
    //   }
    // }
  }

  function cafeButtonHandler(event) {
    return (
      <div>
        <Button
          variant="outlined"
          color="success"
          onClick={() => handleEmployeeAssignCafeButton(event)}
        >
          assign to this cafe
        </Button>
      </div>
    );
  }

  const [cafeColumnDefs] = useState([
    { field: "no", width: 75 },
    { field: "name", width: 100 },
    { field: "location", width: 120, filter: "agLocationFilter" },
    { field: "totalEmployees", width: 150 },
    {
      field: "action",
      width: 250,
      cellRenderer: cafeButtonHandler,
    },
  ]);

  const [employeeColumnDefs] = useState([
    { field: "id", width: 125 },
    { field: "name", width: 100 },
    { field: "days_worked", headerName: "Days worked", width: 120 },
    { field: "gender", headerName: "Gender", width: 100 },
    { field: "action", width: 400, cellRenderer: employeeButtonRenderer },
  ]);

  useEffect(() => {
    getEmployeeData();
  }, []);

  useEffect(() => {
    getEmployeeData();
    getCafeData();
  }, [currentTab, hasUpdate]);

  useEffect(() => {
    setNameHelperText("");
    setEmailHelperText("");
    setPhoneNumHelperText("");
    setGenderHelperText("");
    setAssignCafeHelperText("");
    setName("");
    setEmail("");
    setPhoneNum("");
    setGender("");
    setAssignCafe("");
  }, [currentTab]);

  useEffect(() => {
    const updateEdit = () => {
      if (editEmployeeObject && Object.keys(editEmployeeObject).length) {
        setEditName(editEmployeeObject.name);
        setEditEmail(editEmployeeObject.email_address);
        setEditPhoneNum(editEmployeeObject.phone_number);
        setEditGender(editEmployeeObject.gender);
        setEditAssignCafe(editEmployeeObject.currentAssignment?.cafeId || "");
        setEditId(editEmployeeObject.id);
      } else {
        setEditName("");
        setEditEmail("");
        setEditPhoneNum("");
        setEditGender("");
        setEditAssignCafe("");
        setEditId("");
      }
    };
    updateEdit();
  }, [editEmployeeObject]);

  async function getCafeData() {
    const cafeData = await CafeService.getAllCafes();
    if (cafeData.status >= 400) {
      setSnackBarMsg(cafeData.data.message);
      setSnackBarSeverity("error");
      setSnackBarToggle(true);
    } else {
      const data = cafeData.data.data.map((element, index) => {
        return { ...element, no: index + 1 };
      });
      if (!cafeDataList) {
        dispatch(setCafeList(data));
      }
    }
  }

  async function getEmployeeData() {
    const employeeData = await EmployeeService.getAllEmployees();
    if (employeeData.status >= 400) {
      setSnackBarMsg(employeeData.data.message);
      setSnackBarSeverity("error");
      setSnackBarToggle(true);
    } else {
      dispatch(setEmployeeList(employeeData.data.data));
    }
  }

  function changeTab(event) {
    if (event === "list") {
      setTabList(["list"]);
      setEditEmployeeObject({});
    }
    if (event === "create") {
      setTabList(["list", "create"]);
      setEditEmployeeObject({});
    }
    setCurrentTab(event);
  }

  async function submitForm() {
    const validForm = validateForm("new");
    if (validForm) {
      let result = await EmployeeService.createEmployee({
        name,
        email_address: email,
        phone_number: phoneNum,
        gender,
        assignCafeId: assignCafe,
      });
      if (result.status >= 400) {
        setSnackBarMsg(result.data.message);
        setSnackBarSeverity("error");
        setSnackBarToggle(true);
      } else {
        setSnackBarMsg(`employee created`);
        setSnackBarSeverity("success");
        setSnackBarToggle(true);
        setTabList(["list"]);
        setCurrentTab("list");
      }
    }
  }

  function closeSnackBar() {
    setSnackBarToggle(false);
  }

  function validateForm(type) {
    let validName = false;
    let validEmail = false;
    let validPhoneNum = false;
    let currentName;
    let currentEmail;
    let currentPhoneNum;

    if (type === "change") {
      currentName = editName;
      currentEmail = editEmail;
      currentPhoneNum = editPhoneNum;
    }
    if (type === "new") {
      currentName = name;
      currentEmail = email;
      currentPhoneNum = phoneNum;
    }

    if (!currentName || currentName.length < 6 || currentName.length > 10) {
      setNameHelperText(`name is required and length must be between 6 and 10`);
    } else {
      setNameHelperText(``);
      validName = true;
    }
    if (!currentEmail || !currentEmail.includes("@")) {
      setEmailHelperText(`email is required and must be valid email format`);
    } else {
      setEmailHelperText(``);
      validEmail = true;
    }
    if (!currentPhoneNum || currentPhoneNum.length > 256) {
      setPhoneNumHelperText(
        `description is required and length must not be more than 256`
      );
    } else {
      setPhoneNumHelperText(``);
      validPhoneNum = true;
    }

    if (validName && validEmail && validPhoneNum) {
      return true;
    } else {
      return false;
    }
  }

  async function submitChangesForm() {
    const validForm = validateForm("change");
    if (validForm) {
      console.log({
        name: editName,
        email_address: editEmail,
        phone_number: editPhoneNum,
        gender: editGender,
        assignCafeId: editAssignCafe,
      });
      let result = await EmployeeService.updateEmployeeInfo(editId, {
        name: editName,
        email_address: editEmail,
        phone_number: editPhoneNum,
        gender: editGender,
        assignCafeId: editAssignCafe,
      });
      if (result.status >= 400) {
        setSnackBarMsg(result.data.message);
        setSnackBarSeverity("error");
        setSnackBarToggle(true);
      } else {
        setSnackBarMsg(`employee updated`);
        setSnackBarSeverity("success");
        setSnackBarToggle(true);
        setTabList(["list"]);
        setCurrentTab("list");
      }
    }
  }

  function test(event) {
    console.log(assignCafe);
    console.log(event);
    console.log(cafeSelectList);
    console.log(editEmployeeObject);
  }

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
            Add New Employee
          </Button>
        )}
      </div>
      <h1>Manage Employees</h1>
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
            rowData={employeeDataList}
            columnDefs={employeeColumnDefs}
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
            label="Employee's Name"
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
            id="email"
            label="Employee's Email"
            name="email"
            autoFocus
            onChange={(event) => setEmail(event.target.value)}
            helperText={emailHelperText}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phoneNum"
            label="Employee's Phone number"
            name="phoneNum"
            autoFocus
            onChange={(event) => setPhoneNum(event.target.value)}
            helperText={phoneNumHelperText}
          />
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">
              Employee's Gender
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
                onSelect={setGender}
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
            </RadioGroup>
            <FormHelperText id="my-helper-text">
              {genderHelperText}
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Employee's Assigned Café
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={assignCafe}
              label="Employee's Assigned Café"
              onChange={(event) => setAssignCafe(event.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {cafeDataList &&
                cafeDataList.map((element) => {
                  return (
                    <MenuItem value={element.id}>
                      {element.name} [location: {element.location}]
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>
      )}
      {currentTab && currentTab.includes("edit") && (
        <div>
          <div>
            <TextField
              margin="normal"
              fullWidth
              id="name"
              label="Employee's Name"
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
              id="email"
              label="Employee's Email"
              name="email"
              autoFocus
              onChange={(event) => setEditEmail(event.target.value)}
              value={editEmail}
              helperText={emailHelperText}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phoneNum"
              label="Employee's Phone number"
              name="phoneNum"
              autoFocus
              onChange={(event) => setEditPhoneNum(event.target.value)}
              value={editPhoneNum}
              helperText={phoneNumHelperText}
            />
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Employee's Gender
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={editGender}
                onChange={(event) => setEditGender(event.target.value)}
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
              </RadioGroup>
              <FormHelperText id="my-helper-text">
                {genderHelperText}
              </FormHelperText>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Employee's Assigned Café
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={editAssignCafe}
                label="Employee's Assigned Café"
                onChange={(event) => setEditAssignCafe(event.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {cafeDataList &&
                  cafeDataList.map((element) => {
                    return (
                      <MenuItem value={element.id}>
                        {element.name} [location: {element.location}]
                      </MenuItem>
                    );
                  })}
              </Select>
              <FormHelperText id="my-helper-text">
                {assignCafeHelperText}
              </FormHelperText>
            </FormControl>
          </div>
        </div>
      )}
      {currentTab && currentTab.includes("assign cafe") && (
        <div>
          <div>
            <TextField
              margin="normal"
              fullWidth
              id="id"
              label="Employee's Id"
              name="id"
              autoFocus
              disabled
              value={editEmployeeObject.id}
            />
            <TextField
              margin="normal"
              fullWidth
              id="name"
              label="Employee's Name"
              name="name"
              autoFocus
              disabled
              value={editEmployeeObject.name}
            />
            <div>
              Cafe List
              <div
                className="ag-theme-alpine"
                style={{ width: "auto", height: 500 }}
              >
                <AgGridReact
                  rowData={cafeDataList}
                  columnDefs={cafeColumnDefs}
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
            Create Employee
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
        <Button onClick={(event) => test(event)}>Test</Button>
      </div>
    </div>
  );
}
