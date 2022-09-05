import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { deleteRole, fetchAllRole } from "../../services/roleService";
import { toast } from "react-toastify";
const TableRole = forwardRef((props, ref) => {
  const [listRoles, setListRoles] = useState([]);

  useEffect(() => {
    getAllRoles();
  }, []);
  useImperativeHandle(ref, () => ({
    fetchListRoleAgian() {
      getAllRoles();
    },
  }));

  const getAllRoles = async () => {
    let data = await fetchAllRole();
    if (data && +data.EC === 0) {
      setListRoles(data.DT);
    }
  };

  const handleDeleteRole = async (role) => {
    let data = await deleteRole(role);
    if (data && data.EC === 0) {
      toast.success(data.EM);
      await getAllRoles();
    }
  };
  return (
    <>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Url</th>
            <th scope="col">Description</th>

            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listRoles && listRoles.length > 0 ? (
            <>
              {listRoles.map((item, idx) => {
                return (
                  <tr key={`row-${idx}`}>
                    <td>{item.id}</td>
                    <td>{item.url}</td>
                    <td>{item.description}</td>

                    <td>
                      <span
                        title="delete"
                        className="delete"
                        onClick={() => handleDeleteRole(item)}
                      >
                        <i className="fa fa-trash"></i>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </>
          ) : (
            <>
              <tr>
                <td colSpan={4}>Not Found Roles</td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </>
  );
});
export default TableRole;
