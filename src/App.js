import React, { useEffect, useState } from "react";
import logo from './logo.svg';
import './App.css';
import AddItems from "./components/AddItems";
import useGetdata from "./components/useGetdata";
import useDeleteItem from "./components/useDeleteItem";
import SimpleModal from "./components/SimpleModal";
import RadioSelector from "./components/radioSelector/radioSelector";
import "./styles/global.css";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
function App() {
  const [householditems, setHouseholdItems] = useState([]);
  const householditemsData = useGetdata();
  const { deleteItem, error } = useDeleteItem();
  const [editData, setEditData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVegSelected, setIsVegSelected] = useState(true);
  const [isNonVegSelected, setIsNonVegSelected] = useState(true);

  useEffect(() => {
    setHouseholdItems(householditemsData);
  }, [householditemsData]);

  const updateHouseholdItems = (newItems) => {
    setHouseholdItems(newItems);
  };

  const deleteItems = async (itemName, documentId) => {
    try {
      if (!documentId || !householditems) {
        console.error("Invalid documentId or householditems");
        return;
      }
      await deleteItem(itemName, documentId, householditems, setHouseholdItems);
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const handleEditModalOpen = () => {
    setModalOpen(true);
  };

  const edit = (response) => {
    setEditData(response);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpeneModal = () => {
    setModalOpen(true);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const formatDateFromMilliseconds = (timestamp) => {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  const expirydate = (timestamp) => {
    const currentDate = new Date().getTime();
    const expiryDate = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);
    const timeDifference = expiryDate.getTime() - currentDate;
    const daysToExpire = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysToExpire;
  };
  const filteredItems = householditems
    .map((item) => {
      const filteredCategories = item.categories.filter((category) => {
        const matchesSearchQuery = category.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesVegFilter =
          (isVegSelected && category.veg === "veg") ||
          (isNonVegSelected && category.veg === "nonVeg");
        return matchesSearchQuery && matchesVegFilter;
      });

      return {
        ...item,
        categories: filteredCategories,
      };
    })
    .filter((item) => item.categories.length > 0);

  return (
    <div>
      <Fab
        className="custom-fab"
        onClick={handleOpeneModal}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <SimpleModal
        open={modalOpen}
        handleCloseModal={handleCloseModal}
        householditems={householditems}
        updateItems={updateHouseholdItems}
        editData={editData}
        handleEditModalOpen={handleEditModalOpen}
      />

      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="searchBox"
      />

      <RadioSelector
        isVegSelected={isVegSelected}
        setIsVegSelected={setIsVegSelected}
        isNonVegSelected={isNonVegSelected}
        setIsNonVegSelected={setIsNonVegSelected}
      />

      <div className="wrapperItems">
        {filteredItems.map((items, index) => {
          if (items.categories && Array.isArray(items.categories)) {
            return items.categories.map(
              (response, subIndex) => (
                (
                  <div className="card" key={`${items.id}-${subIndex}`}>
                    <h1>{response.name}</h1>
                    <p>
                      Bought on -{" "}
                      {formatDateFromMilliseconds(response.boughtdate)}
                    </p>
                    <p>
                      Expiring on -{" "}
                      {formatDateFromMilliseconds(response.expirydate)}
                    </p>
                    <p>Quantityyyyyyyyyy - {response.quantity}</p>
                    <h2>{response.veg}</h2>
                    <p>Expires in - {expirydate(response.expirydate)} Days</p>
                    <button
                      onClick={() => deleteItems(response.name, items.id)}
                    >
                      DeleteZZZZ
                    </button>
                    <button onClick={() => edit(response)}>EDIT</button>
                  </div>
                )
              )
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default App;
