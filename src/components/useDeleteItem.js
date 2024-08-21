  import { useState } from "react";
  import { updateDoc, doc, arrayRemove, getDoc, deleteDoc } from "firebase/firestore";
  import { db } from "../firebase-config";

  const useDeleteItem = () => {
    const [error, setError] = useState(null);
  
    const deleteItem = async (itemName, documentId, householditems, setHouseholdItems) => {
      try {
        // Validate documentId and householditems
        if (!documentId || !householditems) {
          console.error("Invalid documentId or householditems");
          return;
        }
    
        // Log relevant information for debugging
        console.log("Deleting item from document:", documentId);
        console.log("Current householditems:", householditems);
    
        // Find the item to delete from householditems
        const itemToDelete = householditems.find((item) => item.id === documentId);
    
        if (!itemToDelete) {
          console.error("Item not found in householditems");
          return;
        }
    
        const categoryToDelete = itemToDelete.categories.find((category) => category.name === itemName);
    
        if (!categoryToDelete) {
          console.error("Category not found in item categories");
          return;
        }
    
        const docRef = doc(db, "householditems", documentId);
    
        // Perform deletion
        await updateDoc(docRef, {
          categories: arrayRemove(categoryToDelete) // Remove the category from the categories array
        });
    
        // Update state
        // Update the state to reflect the changes in the UI
        setHouseholdItems((prevItems) => {
          const updatedItems = prevItems.map((item) => {
            if (item.id === documentId && item.categories) {
              item.categories = item.categories.filter((category) => category.name !== itemName);
            }
            return item;
          });
          return updatedItems;
        });
    
        console.log(`Deleted category with name: ${itemName} from document: ${documentId}`);
      } catch (error) {
        setError(error);
        console.error("Error deleting item: ", error);
      }
    };
    
  
    return { deleteItem, error };
  };
  
  export default useDeleteItem;