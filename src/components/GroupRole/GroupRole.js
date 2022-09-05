import "./GroupRole.scss";
import { useState, useEffect } from "react";
import { fetchGroup } from "../../services/userService";
import { toast } from "react-toastify";
import {
  fetchAllRole,
  fetchRolesByGroup,
  assignRolesByGroupS,
} from "../../services/roleService";
import _ from "lodash";
const GroupRole = () => {
  const [userGroups, setUserGroups] = useState([]);
  const [listRoles, setListRoles] = useState([]);
  const [selectGroup, setSelectGroup] = useState("");

  const [assignRolesByGroup, setAssignRolesByGroup] = useState([]);
  useEffect(() => {
    getGroups();
    getAllRoles();
  }, []);

  const getAllRoles = async () => {
    let data = await fetchAllRole();
    if (data && +data.EC === 0) {
      setListRoles(data.DT);
    }
  };

  const getGroups = async () => {
    let res = await fetchGroup();
    if (res && res.EC === 0) {
      setUserGroups(res.DT);
    } else {
      toast.error(res.EM);
    }
  };

  const handleOnChangeGroup = async (value) => {
    setSelectGroup(value);
    if (value) {
      let data = await fetchRolesByGroup(value);

      if (data && data.EC === 0) {
        let result = buildDataRolesByGroup(data.DT.Roles, listRoles);
        setAssignRolesByGroup(result);
      }
    }
  };

  const buildDataRolesByGroup = (groupRoles, allRoles) => {
    let result = [];
    if (allRoles && allRoles.length > 0) {
      allRoles.map((role) => {
        let obj = {};
        obj.url = role.url;
        obj.id = role.id;
        obj.description = role.description;
        obj.isAssigned = false;
        if (groupRoles && groupRoles.length > 0) {
          obj.isAssigned = groupRoles.some((item) => item.url === obj.url);
        }

        result.push(obj);
      });
    }
    return result;
  };

  const handleCheckBoxtRole = (value) => {
    const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);
    let foundIndex = _assignRolesByGroup.findIndex(
      (item) => +item.id === +value
    );
    if (foundIndex > -1) {
      _assignRolesByGroup[foundIndex].isAssigned =
        !_assignRolesByGroup[foundIndex].isAssigned;
    }
    setAssignRolesByGroup(_assignRolesByGroup);
  };

  const buildDataToSave = () => {
    let result = {};
    const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);
    result.groupId = selectGroup;
    let groupRolesFilter = _assignRolesByGroup.filter(
      (item) => item.isAssigned === true
    );
    let finalGroupRoles = groupRolesFilter.map((item) => {
      let data = { groupId: +selectGroup, roleId: +item.id };
      return data;
    });
    result.groupRoles = finalGroupRoles;
    return result;
  };

  const handleBtnSave = async () => {
    console.log(assignRolesByGroup);
    let data = buildDataToSave();
    let res = await assignRolesByGroupS(data);
    if (res && res.EC === 0) {
      toast.success(res.EM);
      getGroups();
      getAllRoles();
    }
  };
  return (
    <div className="group-role-container">
      <div className="container">
        <div className="container mt-3">
          <h4>Group Role:</h4>
          <div className="assign-group-role">
            <div className="col-12 col-sm-6 form-group">
              <label>
                Select Group (<span className="red">*</span>) :
              </label>
              <select
                className="form-select"
                onChange={(e) => handleOnChangeGroup(e.target.value)}
              >
                <option value="">Please select your group</option>
                {userGroups.length > 0 &&
                  userGroups.map((item, index) => {
                    return (
                      <option key={`group-${index}`} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <hr />
            {selectGroup && (
              <div className="roles">
                <h5>Assign Roles :</h5>
                {assignRolesByGroup &&
                  assignRolesByGroup.length > 0 &&
                  assignRolesByGroup.map((item, index) => {
                    return (
                      <div className="form-check" key={`list-role-${index}`}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`list-role-${index}`}
                          value={item.id}
                          checked={item.isAssigned}
                          onChange={(e) => handleCheckBoxtRole(e.target.value)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`list-role-${index}`}
                        >
                          {item.url}
                        </label>
                      </div>
                    );
                  })}
                <div className="mt-3">
                  <button
                    className="btn btn-warning"
                    onClick={() => handleBtnSave()}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupRole;
