import "./Role.scss";
import { useEffect, userState, useState, useRef } from "react";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { createRoles } from "../../services/roleService";
import TableRole from "./TableRole";
const Role = () => {
  const dataChildDefault = { url: "", description: "", isValidUrl: true };

  const childRef = useRef();
  const [listChilds, setListChilds] = useState({
    child1: dataChildDefault,
  });
  // useEffect(() => {
  //   Object.entries(listChilds).map(([key, value]) => {
  //     console.log("key", key);
  //     console.log("value", value);
  //   });
  // });

  const handleOnChangeInput = (name, value, key) => {
    let _listChilds = _.cloneDeep(listChilds);

    _listChilds[key][name] = value;
    if (value && name === "url") {
      _listChilds[key]["isValidUrl"] = true;
    }
    setListChilds(_listChilds);
  };
  const handleAddInput = () => {
    let _listChilds = _.cloneDeep(listChilds);
    _listChilds[`child-${uuidv4()}`] = dataChildDefault;
    setListChilds(_listChilds);
  };

  const handleDeleteInput = (id) => {
    let _listChilds = _.cloneDeep(listChilds);
    delete _listChilds[id];
    setListChilds(_listChilds);
  };

  const buildDataToPersist = () => {
    let _listChilds = _.cloneDeep(listChilds);
    let result = [];
    Object.entries(_listChilds).map(([key, child], idx) => {
      result.push({
        url: child.url,
        description: child.description,
      });
    });
    return result;
  };

  const handleButtonSave = async () => {
    let invalidObj = Object.entries(listChilds).find(([key, child], idx) => {
      return child && !child.url;
    });
    if (!invalidObj) {
      //call api
      let data = buildDataToPersist();
      let res = await createRoles(data);
      if (res && res.EC === 0) {
        toast.success(res.EM);
        childRef.current.fetchListRoleAgian();
      }
    } else {
      toast.error("Input URL must not be empty");
      let _listChilds = _.cloneDeep(listChilds);
      const key = invalidObj[0];
      _listChilds[key]["isValidUrl"] = false;
      setListChilds(_listChilds);
    }
  };

  return (
    <div className="role-container">
      <div className="container">
        <div className="adding-roles row mt-3">
          <div className="title-role">
            <h4>add A new role....</h4>
          </div>
          <div className="role-parent">
            {Object.entries(listChilds).map(([key, child], idx) => {
              return (
                <div className="row role-child" key={`child-${key}`}>
                  <div className="col-5 form-group">
                    <label>URL: </label>
                    <input
                      type="text"
                      className={
                        child.isValidUrl
                          ? "form-control"
                          : "form-control is-invalid"
                      }
                      value={child.url}
                      onChange={(e) =>
                        handleOnChangeInput("url", e.target.value, key)
                      }
                    />
                  </div>
                  <div className="col-5 form-group">
                    <label>Description:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={child.description}
                      onChange={(e) =>
                        handleOnChangeInput("description", e.target.value, key)
                      }
                    />
                  </div>
                  <div className="col-2 mt-4 actions">
                    <i
                      className="fa fa-plus-circle add"
                      onClick={() => handleAddInput()}
                    ></i>
                    {idx >= 1 && (
                      <i
                        className="fa fa-trash delete"
                        onClick={() => handleDeleteInput(key)}
                      ></i>
                    )}
                  </div>
                </div>
              );
            })}
            <div>
              <button
                className="btn btn-warning mt-3"
                onClick={() => handleButtonSave()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="mt-3 table-role">
          <h4>List Current Roles</h4>
          <TableRole ref={childRef} />
        </div>
      </div>
    </div>
  );
};

export default Role;
