import React, { useEffect, useState } from "react";
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";
import dayjs from "dayjs";
import { db } from "../firebase-config";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";

import "./AddItems.css";
import { DOC_REF } from "../config";

const AddItems = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    boughtdate: dayjs(),
    expirydate: dayjs(),
    veg: true,
  });

  useEffect(() => {
    if (props.editData) {
      const { boughtdate, expirydate } = props.editData;

      setFormData({
        ...props.editData,
        boughtdate: boughtdate ? dayjs(boughtdate.toDate()) : dayjs(),
        expirydate: expirydate ? dayjs(expirydate.toDate()) : dayjs(),
      });
    } else {
      setFormData({
        name: "",
        quantity: 0,
        boughtdate: dayjs(),
        expirydate: dayjs(),
        veg: true,
      });
    }
  }, [props.editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "veg" ? e.target.value : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleDateChange = (date, type) => {
    if (!date) return;

    if (type === "boughtdate") {
      setFormData((prevData) => ({
        ...prevData,
        boughtdate: date,
      }));
    } else if (type === "expirydate") {
      setFormData((prevData) => ({
        ...prevData,
        expirydate: date,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const docRef = doc(db, DOC_REF);
      const docSnapshot = await getDoc(docRef);
      const currentData = docSnapshot.data().categories || [];

      const updatedData = [...currentData, {
        ...formData,
        boughtdate: Timestamp.fromDate(formData.boughtdate.toDate()),
        expirydate: Timestamp.fromDate(formData.expirydate.toDate()),
      }];

      await updateDoc(docRef, { categories: updatedData });

      props.updateItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems[0].categories.push({
          ...formData,
          boughtdate: Timestamp.fromDate(formData.boughtdate.toDate()),
          expirydate: Timestamp.fromDate(formData.expirydate.toDate()),
        });
        return updatedItems;
      });

      props.handleCloseModal();

      setFormData({
        name: "",
        quantity: 0,
        boughtdate: dayjs(),
        expirydate: dayjs(),
        veg: true,
      });
    } catch (error) {
      console.error("Error adding new item: ", error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!formData.name) {
        console.error("Name is required for update");
        return;
      }

      const selectedItemIndex = props.householditems.findIndex((item) =>
        item.categories.some((category) => category.name === formData.name)
      );

      if (selectedItemIndex === -1) {
        console.error("Selected item not found");
        return;
      }

      const updatedItems = [...props.householditems];

      updatedItems[selectedItemIndex].categories.forEach((category) => {
        if (category.name === formData.name) {
          category.quantity = formData.quantity;
          category.boughtdate = Timestamp.fromDate(formData.boughtdate.toDate());
          category.expirydate = Timestamp.fromDate(formData.expirydate.toDate());
          category.veg = formData.veg;
        }
      });

      const docRef = doc(db, DOC_REF);
      await updateDoc(docRef, {
        categories: updatedItems[selectedItemIndex].categories,
      });

      props.updateItems(updatedItems);

      console.log("Item updated successfully");
    } catch (error) {
      console.error("Error updating item: ", error);
    }
  };

  return (
    <div className="">
      <div className="text-fields-wrapper">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Name of the item"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              label="Quantity"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formData.boughtdate}
                onChange={(date) => handleDateChange(date, "boughtdate")}
                label="Select Bought Date"
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formData.expirydate}
                onChange={(date) => handleDateChange(date, "expirydate")}
                label="Select Expiry Date"
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <Select name="veg" value={formData.veg} onChange={handleChange}>
                <MenuItem value="veg">Veg</MenuItem>
                <MenuItem value="nonVeg">Non-Veg</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSubmit}>
              Add Itemzz
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button variant="contained" onClick={handleUpdate}>
              UPDATE
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default AddItems;
