import React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddItems from "./AddItems";
import '../styles/global.css'

const SimpleModal = ({
  open,
  handleCloseModal,
  householditems,
  updateItems,
  editData,
  handleOpenModal,
}) => {

  return (
    <div>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
           Add Item
          </Typography>
          <AddItems
            householditems={householditems}
            updateItems={updateItems}
            editData={editData}
            handleCloseModal={handleCloseModal}
          />
 
       
          <Button className="mt-1" variant="contained" onClick={handleCloseModal}>Close </Button>{" "}
          {/* Add close button */}
        </Box>
      </Modal>
    </div>
  );
};

export default SimpleModal;
