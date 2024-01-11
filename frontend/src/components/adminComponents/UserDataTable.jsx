import { useState } from "react";
import { Button, Modal, Table, Form as BootstrapForm } from "react-bootstrap";
import { toast } from "react-toastify";
import { useBlockUserByAdminMutation, useUnblockUserByAdminMutation } from "../../slices/adminApiSlice";
import PropTypes from 'prop-types';

const UsersDataTable = ({ users, setUsersData }) => {
  UsersDataTable.propTypes = {
    users: PropTypes.array.isRequired
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false); // State for the confirmation dialog
  const [userIdToBlock, setUserIdToBlock] = useState(null); // Track the user ID to block
  const [userIdToUnblock, setUserIdToUnblock] = useState(null); // Track the user ID to unblock
  
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobile.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [blockUserByAdmin, { isLoading: isBlocking }] = useBlockUserByAdminMutation();
  const [unblockUserByAdmin, { isLoading: isUnblocking }] = useUnblockUserByAdminMutation();


  const handleBlock = async () => {
    try {      
      await blockUserByAdmin({ userId: userIdToBlock });
      toast.success("User Blocked Successfully.");
      setUserIdToBlock(null);
      setShowConfirmation(false); 

      // Update the local state to reflect the blocked status
      setUsersData(prevUsers => {
        return prevUsers.map(user =>
          user._id === userIdToBlock ? { ...user, is_blocked: true } : user
        );
      });
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };
  
  const handleUnblock = async () => {
    try {      
      await unblockUserByAdmin({ userId: userIdToUnblock });
      toast.success("User Un Blocked Successfully.");
      setUserIdToUnblock(null); 
      setShowConfirmation(false); 

      // Update the local state to reflect the unblocked status
      setUsersData(prevUsers => {
        return prevUsers.map(user =>
          user._id === userIdToUnblock ? { ...user, is_blocked: false } : user
        );
      });
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };


  return (
    <>
      <BootstrapForm>
        <BootstrapForm.Group className="mt-3" controlId="exampleForm.ControlInput1">
          <BootstrapForm.Label>Search users:</BootstrapForm.Label>
          <BootstrapForm.Control
            style={{ width: "500px" }}
            value={searchQuery}
            type="text"
            placeholder="Enter Name or email........"
            onChange={handleSearch}
          />
        </BootstrapForm.Group>
      </BootstrapForm>

      <Table className="mt-3 mb-3" striped bordered hover responsive>
        <thead>
          <tr>
            <th>SI No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{ user.mobile}</td>
              <td>
                {user.is_blocked === false ? (
                  <span className="text-success" style={{ fontWeight: "bold" }}>Active</span>
                ) : (
                  <span className="text-danger" style={{ fontWeight: "bold" }}>Blocked</span>
                )}
              </td>
               <td>
                  {user.is_blocked === false ? (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => {
                        setUserIdToBlock(user._id);
                        setShowConfirmation(true); 
                      }}
                    >
                      Block
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="success"
                      onClick={() => {
                        setUserIdToUnblock(user._id);
                        setShowConfirmation(true);
                      }}
                    >
                      Unblock
                    </Button>
                  )}
                </td> 
            </tr>
          ))}
        </tbody>
      </Table>

      
      {/* Confirmation Dialog */}
      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userIdToBlock ? (
            <>
              Are you sure you want to actually block this user?
              <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleBlock} disabled={isBlocking}>
                {isBlocking ? "Blocking..." : "Block"}
              </Button>
            </>
          ) : userIdToUnblock ? (
            <>
              Are you sure you want to unblock this user?
              <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleUnblock} disabled={isUnblocking}>
                {isUnblocking ? "Unblocking..." : "Unblock"}
              </Button>
            </>
          ) : null}
        </Modal.Body>
      </Modal>

    </>
  );
};

export default UsersDataTable;
