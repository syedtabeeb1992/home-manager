import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
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
  const [expiringProducts, setExpiringProducts] = useState([]);

  useEffect(() => {
    setHouseholdItems(householditemsData);
    const allFilteredExpiringProducts = householditemsData.reduce(
      (acc, item) => {
        const filteredExpiringProducts = item.categories.filter((product) => {
          return expirydate(product.expirydate) <= 5;
        });
        return acc.concat(filteredExpiringProducts);
      },
      []
    );

    setExpiringProducts(allFilteredExpiringProducts);
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

      {expiringProducts.length > 0 ? (
        <div className="padding-univarsal">
          <h1>Expiring Items</h1>
          <div className="wrapperItems pd-l-0">
            {expiringProducts.map((response) => {
              return (
                <div
                  className={
                    expirydate(response.expirydate) <= 0
                      ? "card redText"
                      : "card"
                  }
                >
                  <h1>{response.name}</h1>
                  <p>Quantity - {response.quantity}</p>
                  <p
                    className={
                      expirydate(response.expirydate) < 2 ? "redText" : ""
                    }
                  >
                    {expirydate(response.expirydate) < 0
                      ? `Expired  : ${expirydate(response.expirydate)} Days Ago`
                      : `Expires in : ${expirydate(response.expirydate)} Days`}
                  </p>
                  <button
                    onClick={() => deleteItems(response.name, response.id)}
                  >
                    Delete
                  </button>
                  <button onClick={() => edit(response)}>EDIT</button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="wrapperItems">
        {filteredItems.map((items, index) => {
          if (items.categories && Array.isArray(items.categories)) {
            return items.categories.map((response, subIndex) => (
              <div
                className={
                  expirydate(response.expirydate) <= 0 ? "card redText" : "card"
                }
                key={`${items.id}-${subIndex}`}
              >
                <h1>{response.name}</h1>
                <p>
                  Bought on - {formatDateFromMilliseconds(response.boughtdate)}
                </p>
                <p>
                  Expiring on -{" "}
                  {formatDateFromMilliseconds(response.expirydate)}
                </p>
                <p>Quantity - {response.quantity}</p>
                <h2>{response.veg}</h2>

                <p
                  className={
                    expirydate(response.expirydate) < 2 ? "redText" : ""
                  }
                >
                  {expirydate(response.expirydate) < 0
                    ? `Expired  : ${expirydate(response.expirydate)} Days Ago`
                    : `Expires in : ${expirydate(response.expirydate)} Days`}
                </p>
                <button onClick={() => deleteItems(response.name, items.id)}>
                  Delete
                </button>
                <button onClick={() => edit(response)}>EDIT</button>
              </div>
            ));
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default App;
